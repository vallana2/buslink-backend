import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import prisma from "../../config/database";

const generateTicketForBooking = async (bookingId: string) => {
  const qrString = `BUSLINK-TKT-${uuidv4()}`;
  await QRCode.toDataURL(qrString); // validates it can generate

  const ticket = await prisma.ticket.create({
    data: { bookingId, qrCode: qrString },
  });

  return ticket;
};

export const payWithMobileMoneyService = async (
  bookingId: string,
  passengerId: string,
  data: { phone: string; amount: number; provider: "MTN" | "AIRTEL" }
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { schedule: true, payment: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.passengerId !== passengerId) throw new Error("Access denied");
  if (booking.status !== "PENDING") throw new Error("Booking is not pending payment");
  if (booking.payment) throw new Error("This booking is already paid");

  // Simulate payment success
  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: data.amount,
      method: data.provider === "MTN" ? "MTN_MOBILE_MONEY" : "AIRTEL_MONEY",
      status: "SUCCESS",
      transactionId: `TXN-${uuidv4()}`,
      paidAt: new Date(),
    },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
  });

  const ticket = await generateTicketForBooking(bookingId);

  return { payment, ticket };
};

export const payWithCardService = async (
  bookingId: string,
  passengerId: string,
  data: { amount: number; cardNumber: string }
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.passengerId !== passengerId) throw new Error("Access denied");
  if (booking.status !== "PENDING") throw new Error("Booking is not pending payment");
  if (booking.payment) throw new Error("This booking is already paid");

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: data.amount,
      method: "CARD",
      status: "SUCCESS",
      transactionId: `TXN-${uuidv4()}`,
      paidAt: new Date(),
    },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
  });

  const ticket = await generateTicketForBooking(bookingId);

  return { payment, ticket };
};