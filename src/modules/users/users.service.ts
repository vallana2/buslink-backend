import bcrypt from "bcryptjs";
import prisma from "../../config/database";

// System Admin creates Agency Admin
export const createAgencyAdminService = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  agencyId: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: "AGENCY_ADMIN",
      agencyId: data.agencyId,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    agencyId: user.agencyId,
  };
};

// Agency Admin creates Driver
export const createDriverService = async (
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    licenseNumber: string;
  },
  agencyId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: "DRIVER",
      agencyId: agencyId,
      driver: {
        create: {
          licenseNumber: data.licenseNumber,
          agencyId: agencyId,
        },
      },
    },
    include: {
      driver: true,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    agencyId: user.agencyId,
    licenseNumber: user.driver?.licenseNumber,
  };
};

// Get all users (System Admin)
export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      agencyId: true,
      createdAt: true,
      agency: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
};

// Get profile of logged in user
export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      agencyId: true,
      createdAt: true,
      agency: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};