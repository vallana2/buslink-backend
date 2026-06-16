import prisma from "../../config/database";

export const getMyTicketService = async (bookingId: string, passengerId: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { bookingId },
    include: {
      booking: {
        include: {
          passenger: { select: { name: true, phone: true } },
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
      },
    },
  });

  if (!ticket) throw new Error("Ticket not found");
  if (ticket.booking.passengerId !== passengerId) throw new Error("Access denied");

  return ticket;
};

export const validateTicketService = async (qrCode: string, driverUserId: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { qrCode },
    include: {
      booking: {
        include: {
          passenger: { select: { name: true, phone: true } },
          schedule: {
            include: {
              route: { include: { fromStation: true, toStation: true } },
              bus: true,
              driver: true,
            },
          },
        },
      },
    },
  });

  if (!ticket) {
    throw new Error("Invalid ticket — not found");
  }

  if (ticket.isValidated) {
    throw new Error(`Ticket already used at ${ticket.validatedAt}`);
  }

  if (ticket.booking.status !== "CONFIRMED") {
    throw new Error("Booking is not confirmed");
  }

  // Verify this driver owns this trip
  if (ticket.booking.schedule.driver?.userId !== driverUserId) {
    throw new Error("This ticket is not for your trip");
  }

  await prisma.ticket.update({
    where: { qrCode },
    data: { isValidated: true, validatedAt: new Date() },
  });

  await prisma.booking.update({
    where: { id: ticket.booking.id },
    data: { status: "USED" },
  });

  return {
    passenger: ticket.booking.passenger,
    trip: {
      from: ticket.booking.schedule.route.fromStation.name,
      to: ticket.booking.schedule.route.toStation.name,
      departure: ticket.booking.schedule.departureTime,
      bus: ticket.booking.schedule.bus.plateNumber,
    },
  };
};