import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  createAgencyService,
  getAllAgenciesService,
  getAgencyByIdService,
  updateAgencyService,
  approveAgencyService,
  linkAgencyToStationService,
  getAgencyStationsService,
  deleteAgencyService,
} from "./agencies.service";

export const createAgency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, logo } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ message: "Name, email and phone are required" });
      return;
    }

    const agency = await createAgencyService({ name, email, phone, logo });

    res.status(201).json({
      message: "Agency created successfully",
      agency,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAgencies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const agencies = await getAllAgenciesService();
    res.status(200).json({ agencies });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgencyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agency = await getAgencyByIdService(id);
    res.status(200).json({ agency });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateAgency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, phone, logo } = req.body;

    const agency = await updateAgencyService(id, { name, email, phone, logo });

    res.status(200).json({
      message: "Agency updated successfully",
      agency,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAgency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await deleteAgencyService(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const approveAgency = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agency = await approveAgencyService(id);

    res.status(200).json({
      message: "Agency approved successfully",
      agency,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const linkAgencyToStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const agencyId = req.params.id as string;
    const { stationId, counterNumber } = req.body;

    if (!stationId) {
      res.status(400).json({ message: "stationId is required" });
      return;
    }

    const link = await linkAgencyToStationService(
      agencyId,
      stationId,
      counterNumber
    );

    res.status(201).json({
      message: "Agency linked to station successfully",
      link,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAgencyStations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agencyId = (req.params.id as string) || (req.user?.agencyId as string);

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const stations = await getAgencyStationsService(agencyId);
    res.status(200).json({ stations });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};