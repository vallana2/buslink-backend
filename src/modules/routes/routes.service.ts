import prisma from "../../config/database";

export const createRouteService = async (
  data: {
    fromStationId: string;
    toStationId: string;
    distanceKm?: number;
  },
  agencyId: string
) => {
  if (data.fromStationId === data.toStationId) {
    throw new Error("From and To stations cannot be the same");
  }

  const fromStation = await prisma.station.findUnique({
    where: { id: data.fromStationId },
  });
  if (!fromStation) {
    throw new Error("From station not found");
  }

  const toStation = await prisma.station.findUnique({
    where: { id: data.toStationId },
  });
  if (!toStation) {
    throw new Error("To station not found");
  }

  const existingRoute = await prisma.route.findUnique({
    where: {
      agencyId_fromStationId_toStationId: {
        agencyId,
        fromStationId: data.fromStationId,
        toStationId: data.toStationId,
      },
    },
  });

  if (existingRoute) {
    throw new Error("This route already exists for your agency");
  }

  const route = await prisma.route.create({
    data: {
      agencyId,
      fromStationId: data.fromStationId,
      toStationId: data.toStationId,
      distanceKm: data.distanceKm,
    },
    include: {
      fromStation: true,
      toStation: true,
    },
  });

  return route;
};

export const getAgencyRoutesService = async (agencyId: string) => {
  const routes = await prisma.route.findMany({
    where: { agencyId },
    include: {
      fromStation: true,
      toStation: true,
    },
    orderBy: { id: "desc" },
  });

  return routes;
};

export const getRouteByIdService = async (id: string, agencyId: string) => {
  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      fromStation: true,
      toStation: true,
    },
  });

  if (!route) {
    throw new Error("Route not found");
  }

  if (route.agencyId !== agencyId) {
    throw new Error("You do not have access to this route");
  }

  return route;
};

export const updateRouteService = async (
  id: string,
  agencyId: string,
  data: { distanceKm?: number }
) => {
  const route = await prisma.route.findUnique({ where: { id } });

  if (!route) {
    throw new Error("Route not found");
  }

  if (route.agencyId !== agencyId) {
    throw new Error("You do not have access to this route");
  }

  const updated = await prisma.route.update({
    where: { id },
    data,
    include: {
      fromStation: true,
      toStation: true,
    },
  });

  return updated;
};

export const deleteRouteService = async (id: string, agencyId: string) => {
  const route = await prisma.route.findUnique({ where: { id } });

  if (!route) {
    throw new Error("Route not found");
  }

  if (route.agencyId !== agencyId) {
    throw new Error("You do not have access to this route");
  }

  await prisma.route.delete({ where: { id } });

  return { message: "Route deleted successfully" };
};