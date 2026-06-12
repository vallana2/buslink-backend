import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  createBusService,
  getAgencyBusesService,
  getBusByIdService,
  updateBusService,
  deleteBusService,
} from "./buses.service";

export const createBus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { plateNumber, capacity, busType } = req.body;
    const agencyId = req.user?.agencyId as string;

    if (!plateNumber || !capacity) {
      res.status(400).json({ message: "Plate number and capacity are required" });
      return;
    }

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const bus = await createBusService(
      { plateNumber, capacity, busType },
      agencyId
    );

    res.status(201).json({
      message: "Bus added successfully",
      bus,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAgencyBuses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const buses = await getAgencyBusesService(agencyId);
    res.status(200).json({ buses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;

    const bus = await getBusByIdService(id, agencyId);
    res.status(200).json({ bus });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateBus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;
    const { plateNumber, capacity, busType } = req.body;

    const bus = await updateBusService(id, agencyId, {
      plateNumber,
      capacity,
      busType,
    });

    res.status(200).json({
      message: "Bus updated successfully",
      bus,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;

    const result = await deleteBusService(id, agencyId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};