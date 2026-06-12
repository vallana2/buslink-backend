import { Request, Response } from "express";
import {
  createStationService,
  getAllStationsService,
  getStationByIdService,
  updateStationService,
  deleteStationService,
} from "./stations.service";

export const createStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, city, address } = req.body;

    if (!name || !city) {
      res.status(400).json({ message: "Name and city are required" });
      return;
    }

    const station = await createStationService({ name, city, address });

    res.status(201).json({
      message: "Station created successfully",
      station,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllStations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stations = await getAllStationsService();
    res.status(200).json({ stations });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const station = await getStationByIdService(id);
    res.status(200).json({ station });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, city, address } = req.body;

    const station = await updateStationService(id, { name, city, address });

    res.status(200).json({
      message: "Station updated successfully",
      station,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await deleteStationService(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};