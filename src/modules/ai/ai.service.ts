import openai from "../../config/openai";
import prisma from "../../config/database";

export const chatbotService = async (message: string) => {
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are BusLink's customer support assistant. BusLink is a bus ticketing platform in Rwanda connecting passengers with agencies like RITCO, Virunga Express, Horizon Express. Help passengers with booking, routes, schedules, and payment questions. Be concise, friendly, and helpful. If you don't know specific live schedule data, tell them to search in the app.`,
      },
      { role: "user", content: message },
    ],
  });

  return response.choices[0].message.content;
};

export const predictDemandService = async (routeId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const bookings = await prisma.booking.findMany({
    where: {
      schedule: { routeId },
      createdAt: { gte: thirtyDaysAgo },
    },
    include: { schedule: true },
  });

  if (bookings.length === 0) {
    return "Not enough booking data yet to predict demand for this route.";
  }

  const summary = bookings.map((b) => ({
    departureTime: b.schedule.departureTime,
    status: b.status,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a transport analytics assistant. Analyze booking patterns and give a short, practical prediction of busy days/times for this route. Keep it to 2-3 sentences.",
      },
      {
        role: "user",
        content: `Booking data (last 30 days): ${JSON.stringify(summary)}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

export const predictDelayService = async (scheduleId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { route: true },
  });

  if (!schedule) throw new Error("Schedule not found");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const history = await prisma.schedule.findMany({
    where: {
      routeId: schedule.routeId,
      status: "ARRIVED",
      departureTime: { gte: thirtyDaysAgo },
    },
    select: { departureTime: true, arrivalTime: true },
  });

  if (history.length === 0) {
    return "Not enough historical data to predict delay for this route yet.";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a transport delay prediction assistant. Based on historical trip timing data, give a brief estimate of likely delay in minutes and a short reason. Keep it to 2 sentences.",
      },
      {
        role: "user",
        content: `Today's scheduled departure: ${schedule.departureTime}. Historical data: ${JSON.stringify(history)}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

export const checkFraudService = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) return;

  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  const recentBookings = await prisma.booking.findMany({
    where: {
      passengerId: booking.passengerId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentBookings.length < 3) {
    return { isSuspicious: false };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a fraud detection assistant for a bus ticketing platform. Analyze booking frequency patterns and respond ONLY with valid JSON: {"isSuspicious": boolean, "reason": string, "riskLevel": "low"|"medium"|"high"}`,
      },
      {
        role: "user",
        content: `Passenger made ${recentBookings.length} bookings in the last hour. Recent bookings: ${JSON.stringify(recentBookings)}`,
      },
    ],
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");

  if (result.isSuspicious && result.riskLevel === "high") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "FLAGGED" },
    });
  }

  return result;
};