import { Request, Response } from "express";
import {
  createAgencyAdminService,
  createDriverService,
  getAllUsersService,
  getProfileService,
} from "./users.service";
import { AuthRequest } from "../../middleware/authenticate";

export const createAgencyAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, password, agencyId } = req.body;

    if (!name || !email || !phone || !password || !agencyId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await createAgencyAdminService({
      name,
      email,
      phone,
      password,
      agencyId,
    });

    res.status(201).json({
      message: "Agency admin created successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createDriver = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, password, licenseNumber } = req.body;
    const agencyId = req.user?.agencyId;

    if (!name || !email || !phone || !password || !licenseNumber) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const user = await createDriverService(
      { name, email, phone, password, licenseNumber },
      agencyId
    );

    res.status(201).json({
      message: "Driver created successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const user = await getProfileService(userId);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};