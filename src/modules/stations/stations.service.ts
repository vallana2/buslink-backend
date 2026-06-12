import prisma from "../../config/database";

export const createStationService = async (data: {
  name: string;
  city: string;
  address?: string;
}) => {
  const existingStation = await prisma.station.findFirst({
    where: {
      name: data.name,
      city: data.city,
    },
  });

  if (existingStation) {
    throw new Error("Station already exists in this city");
  }

  const station = await prisma.station.create({
    data: {
      name: data.name,
      city: data.city,
      address: data.address,
    },
  });

  return station;
};

export const getAllStationsService = async () => {
  const stations = await prisma.station.findMany({
    orderBy: { city: "asc" },
  });

  return stations;
};

export const getStationByIdService = async (id: string) => {
  const station = await prisma.station.findUnique({
    where: { id },
    include: {
      agencyStations: {
        include: {
          agency: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      },
    },
  });

  if (!station) {
    throw new Error("Station not found");
  }

  return station;
};

export const updateStationService = async (
  id: string,
  data: { name?: string; city?: string; address?: string }
) => {
  const station = await prisma.station.findUnique({ where: { id } });

  if (!station) {
    throw new Error("Station not found");
  }

  const updated = await prisma.station.update({
    where: { id },
    data,
  });

  return updated;
};

export const deleteStationService = async (id: string) => {
  const station = await prisma.station.findUnique({ where: { id } });

  if (!station) {
    throw new Error("Station not found");
  }

  await prisma.station.delete({ where: { id } });

  return { message: "Station deleted successfully" };
};