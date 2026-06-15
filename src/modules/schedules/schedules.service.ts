import prisma from "../../config/database";

export const createScheduleService = async (
  data: {
    routeId: string;
    busId: string;
    driverId?: string;
    departureTime: string;
    arrivalTime?: string;
    price: number;
  },
  agencyId: string
) => {
  // Verify route belongs to this agency
  const route = await prisma.route.findUnique({
    where: { id: data.routeId },
  });
  if (!route) {
    throw new Error("Route not found");
  }
  if (route.agencyId !== agencyId) {
    throw new Error("You do not have access to this route");
  }

  // Verify bus belongs to this agency
  const bus = await prisma.bus.findUnique({
    where: { id: data.busId },
  });
  if (!bus) {
    throw new Error("Bus not found");
  }
  if (bus.agencyId !== agencyId) {
    throw new Error("You do not have access to this bus");
  }

  // If driver provided, verify driver belongs to this agency
  if (data.driverId) {
    const driver = await prisma.driver.findUnique({
      where: { id: data.driverId },
    });
    if (!driver) {
      throw new Error("Driver not found");
    }
    if (driver.agencyId !== agencyId) {
      throw new Error("You do not have access to this driver");
    }
  }

  const schedule = await prisma.schedule.create({
    data: {
      routeId: data.routeId,
      busId: data.busId,
      driverId: data.driverId,
      departureTime: new Date(data.departureTime),
      arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : null,
      price: data.price,
    },
    include: {
      route: {
        include: {
          fromStation: true,
          toStation: true,
        },
      },
      bus: true,
      driver: {
        include: {
          user: {
            select: { name: true, phone: true },
          },
        },
      },
    },
  });

  return schedule;
};

export const getAgencySchedulesService = async (agencyId: string) => {
  const schedules = await prisma.schedule.findMany({
    where: {
      route: { agencyId },
    },
    include: {
      route: {
        include: {
          fromStation: true,
          toStation: true,
        },
      },
      bus: true,
      driver: {
        include: {
          user: { select: { name: true, phone: true } },
        },
      },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
      },
    },
    orderBy: { departureTime: "asc" },
  });

  // Add available seats info
  return schedules.map((s) => ({
    ...s,
    bookedSeats: s.bookings.length,
    availableSeats: s.bus.capacity - s.bookings.length,
    bookings: undefined, // remove raw bookings array from response
  }));
};

export const getScheduleByIdService = async (id: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      route: {
        include: {
          fromStation: true,
          toStation: true,
          agency: { select: { id: true, name: true, logo: true } },
        },
      },
      bus: true,
      driver: {
        include: {
          user: { select: { name: true, phone: true } },
        },
      },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
      },
    },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  return {
    ...schedule,
    bookedSeats: schedule.bookings.length,
    availableSeats: schedule.bus.capacity - schedule.bookings.length,
    bookings: undefined,
  };
};

export const updateScheduleService = async (
  id: string,
  agencyId: string,
  data: {
    busId?: string;
    driverId?: string;
    departureTime?: string;
    arrivalTime?: string;
    price?: number;
    status?: "SCHEDULED" | "BOARDING" | "DEPARTED" | "ARRIVED" | "CANCELLED";
  }
) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { route: true },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  if (schedule.route.agencyId !== agencyId) {
    throw new Error("You do not have access to this schedule");
  }

  const updateData: any = {};
  if (data.busId) updateData.busId = data.busId;
  if (data.driverId) updateData.driverId = data.driverId;
  if (data.departureTime) updateData.departureTime = new Date(data.departureTime);
  if (data.arrivalTime) updateData.arrivalTime = new Date(data.arrivalTime);
  if (data.price !== undefined) updateData.price = data.price;
  if (data.status) updateData.status = data.status;

  const updated = await prisma.schedule.update({
    where: { id },
    data: updateData,
    include: {
      route: { include: { fromStation: true, toStation: true } },
      bus: true,
      driver: { include: { user: { select: { name: true, phone: true } } } },
    },
  });

  return updated;
};

export const deleteScheduleService = async (id: string, agencyId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { route: true },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  if (schedule.route.agencyId !== agencyId) {
    throw new Error("You do not have access to this schedule");
  }

  await prisma.schedule.delete({ where: { id } });

  return { message: "Schedule deleted successfully" };
};

// PUBLIC SEARCH — the most important function for passengers
export const searchSchedulesService = async (params: {
  fromCity?: string;
  toCity?: string;
  date?: string;
}) => {
  const where: any = {
    status: "SCHEDULED",
  };

  if (params.fromCity || params.toCity) {
    where.route = {};
    if (params.fromCity) {
      where.route.fromStation = { city: { equals: params.fromCity, mode: "insensitive" } };
    }
    if (params.toCity) {
      where.route.toStation = { city: { equals: params.toCity, mode: "insensitive" } };
    }
  }

  if (params.date) {
    const startOfDay = new Date(params.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setHours(23, 59, 59, 999);

    where.departureTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  } else {
    // Default: only future schedules
    where.departureTime = { gte: new Date() };
  }

  const schedules = await prisma.schedule.findMany({
    where,
    include: {
      route: {
        include: {
          fromStation: true,
          toStation: true,
          agency: { select: { id: true, name: true, logo: true } },
        },
      },
      bus: true,
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
      },
    },
    orderBy: { departureTime: "asc" },
  });

  // Filter out fully booked, add available seats
  return schedules
    .map((s) => ({
      id: s.id,
      departureTime: s.departureTime,
      arrivalTime: s.arrivalTime,
      price: s.price,
      status: s.status,
      agency: s.route.agency,
      bus: {
        plateNumber: s.bus.plateNumber,
        busType: s.bus.busType,
        capacity: s.bus.capacity,
      },
      route: {
        fromStation: s.route.fromStation,
        toStation: s.route.toStation,
        distanceKm: s.route.distanceKm,
      },
      availableSeats: s.bus.capacity - s.bookings.length,
    }))
    .filter((s) => s.availableSeats > 0);
};