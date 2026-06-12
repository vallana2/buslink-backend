import prisma from "../../config/database";

export const createAgencyService = async (data: {
  name: string;
  email: string;
  phone: string;
  logo?: string;
}) => {
  const existingAgency = await prisma.agency.findFirst({
    where: { name: data.name },
  });

  if (existingAgency) {
    throw new Error("Agency with this name already exists");
  }

  const agency = await prisma.agency.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      logo: data.logo,
      isApproved: true, // System Admin creates it directly, so auto-approved
    },
  });

  return agency;
};

export const getAllAgenciesService = async () => {
  const agencies = await prisma.agency.findMany({
    where: { isApproved: true },
    orderBy: { name: "asc" },
  });

  return agencies;
};

export const getAgencyByIdService = async (id: string) => {
  const agency = await prisma.agency.findUnique({
    where: { id },
    include: {
      agencyStations: {
        include: {
          station: true,
        },
      },
      buses: true,
      routes: true,
    },
  });

  if (!agency) {
    throw new Error("Agency not found");
  }

  return agency;
};

export const updateAgencyService = async (
  id: string,
  data: { name?: string; email?: string; phone?: string; logo?: string }
) => {
  const agency = await prisma.agency.findUnique({ where: { id } });

  if (!agency) {
    throw new Error("Agency not found");
  }

  const updated = await prisma.agency.update({
    where: { id },
    data,
  });

  return updated;
};

export const approveAgencyService = async (id: string) => {
  const agency = await prisma.agency.findUnique({ where: { id } });

  if (!agency) {
    throw new Error("Agency not found");
  }

  const updated = await prisma.agency.update({
    where: { id },
    data: { isApproved: true },
  });

  return updated;
};

// Link agency to a station (agency operates from this station)
export const linkAgencyToStationService = async (
  agencyId: string,
  stationId: string,
  counterNumber?: string
) => {
  const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
  if (!agency) {
    throw new Error("Agency not found");
  }

  const station = await prisma.station.findUnique({ where: { id: stationId } });
  if (!station) {
    throw new Error("Station not found");
  }

  const existingLink = await prisma.agencyStation.findUnique({
    where: {
      agencyId_stationId: {
        agencyId,
        stationId,
      },
    },
  });

  if (existingLink) {
    throw new Error("Agency is already linked to this station");
  }

  const link = await prisma.agencyStation.create({
    data: {
      agencyId,
      stationId,
      counterNumber,
    },
    include: {
      agency: true,
      station: true,
    },
  });

  return link;
};

// Get all stations an agency operates from
export const getAgencyStationsService = async (agencyId: string) => {
  const links = await prisma.agencyStation.findMany({
    where: { agencyId, isActive: true },
    include: { station: true },
  });

  return links;
};