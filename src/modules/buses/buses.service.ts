import prisma from "../../config/database";

export const createBusService = async (
  data: {
    plateNumber: string;
    capacity: number;
    busType?: string;
  },
  agencyId: string
) => {
  const existingBus = await prisma.bus.findUnique({
    where: { plateNumber: data.plateNumber },
  });

  if (existingBus) {
    throw new Error("A bus with this plate number already exists");
  }

  const bus = await prisma.bus.create({
    data: {
      plateNumber: data.plateNumber,
      capacity: data.capacity,
      busType: data.busType,
      agencyId,
    },
  });

  return bus;
};

export const getAgencyBusesService = async (agencyId: string) => {
  const buses = await prisma.bus.findMany({
    where: { agencyId },
    orderBy: { plateNumber: "asc" },
  });

  return buses;
};

export const getBusByIdService = async (id: string, agencyId: string) => {
  const bus = await prisma.bus.findUnique({
    where: { id },
  });

  if (!bus) {
    throw new Error("Bus not found");
  }

  if (bus.agencyId !== agencyId) {
    throw new Error("You do not have access to this bus");
  }

  return bus;
};

export const updateBusService = async (
  id: string,
  agencyId: string,
  data: { plateNumber?: string; capacity?: number; busType?: string }
) => {
  const bus = await prisma.bus.findUnique({ where: { id } });

  if (!bus) {
    throw new Error("Bus not found");
  }

  if (bus.agencyId !== agencyId) {
    throw new Error("You do not have access to this bus");
  }

  const updated = await prisma.bus.update({
    where: { id },
    data,
  });

  return updated;
};

export const deleteBusService = async (id: string, agencyId: string) => {
  const bus = await prisma.bus.findUnique({ where: { id } });

  if (!bus) {
    throw new Error("Bus not found");
  }

  if (bus.agencyId !== agencyId) {
    throw new Error("You do not have access to this bus");
  }

  await prisma.bus.delete({ where: { id } });

  return { message: "Bus deleted successfully" };
};