import prisma from "../../config/database";

export const createBookingService = async (
  scheduleId: string,
  passengerId: string
) => {
  // Get schedule with bus capacity and current bookings
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      bus: true,
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
      },
    },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  if (schedule.status !== "SCHEDULED") {
    throw new Error("This schedule is not available for booking");
  }

  if (new Date(schedule.departureTime) < new Date()) {
    throw new Error("This schedule has already departed");
  }

  const ticketsSold = schedule.bookings.length;
  if (ticketsSold >= schedule.bus.capacity) {
    throw new Error("This bus is fully booked");
  }

  const booking = await prisma.booking.create({
    data: {
      passengerId,
      scheduleId,
      status: "PENDING",
    },
    include: {
      schedule: {
        include: {
          route: {
            include: {
              fromStation: true,
              toStation: true,
              agency: { select: { name: true, logo: true } },
            },
          },
          bus: true,
        },
      },
    },
  });

  return booking;
};

export const getMyBookingsService = async (passengerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { passengerId },
    include: {
      schedule: {
        include: {
          route: {
            include: {
              fromStation: true,
              toStation: true,
              agency: { select: { name: true, logo: true } },
            },
          },
          bus: true,
        },
      },
      payment: true,
      ticket: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

export const getBookingByIdService = async (
  id: string,
  passengerId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      schedule: {
        include: {
          route: {
            include: {
              fromStation: true,
              toStation: true,
              agency: { select: { name: true, logo: true } },
            },
          },
          bus: true,
        },
      },
      payment: true,
      ticket: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.passengerId !== passengerId) {
    throw new Error("You do not have access to this booking");
  }

  return booking;
};

export const cancelBookingService = async (
  id: string,
  passengerId: string
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.passengerId !== passengerId) {
    throw new Error("You do not have access to this booking");
  }

  if (booking.status === "USED") {
    throw new Error("Cannot cancel a used ticket");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Booking is already cancelled");
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return updated;
};

// Agency Admin — view all bookings for their agency
export const getAgencyBookingsService = async (agencyId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      schedule: {
        route: { agencyId },
      },
    },
    include: {
      passenger: {
        select: { name: true, phone: true, email: true },
      },
      schedule: {
        include: {
          route: {
            include: { fromStation: true, toStation: true },
          },
          bus: true,
        },
      },
      payment: true,
      ticket: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};