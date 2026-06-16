import prisma from "../../config/database";

export const getAgencyDriversService = async (agencyId: string) => {
  const drivers = await prisma.driver.findMany({
    where: { agencyId },
    include: {
      user: { select: { name: true, phone: true, email: true } },
    },
  });

  return drivers;
};

export const getMyTripsService = async (driverUserId: string) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) throw new Error("Driver not found");

  const schedules = await prisma.schedule.findMany({
    where: {
      driverId: driver.id,
      departureTime: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
    include: {
      route: { include: { fromStation: true, toStation: true } },
      bus: true,
      bookings: {
        where: { status: { in: ["CONFIRMED", "USED"] } },
        include: { passenger: { select: { name: true, phone: true } } },
      },
    },
    orderBy: { departureTime: "asc" },
  });

  return schedules;
};

export const getTripPassengersService = async (
  scheduleId: string,
  driverUserId: string
) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { driver: true },
  });

  if (!schedule) throw new Error("Schedule not found");
  if (schedule.driver?.userId !== driverUserId) {
    throw new Error("This is not your trip");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      scheduleId,
      status: { in: ["CONFIRMED", "USED"] },
    },
    include: {
      passenger: { select: { name: true, phone: true } },
      ticket: { select: { isValidated: true } },
    },
  });

  return bookings;
};

export const updateTripStatusService = async (
  scheduleId: string,
  driverUserId: string,
  status: "BOARDING" | "DEPARTED" | "ARRIVED"
) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { driver: true },
  });

  if (!schedule) throw new Error("Schedule not found");
  if (schedule.driver?.userId !== driverUserId) {
    throw new Error("This is not your trip");
  }

  const updated = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { status },
  });

  return updated;
};