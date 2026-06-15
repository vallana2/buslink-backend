import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  createRouteService,
  getAgencyRoutesService,
  getRouteByIdService,
  updateRouteService,
  deleteRouteService,
} from "./routes.service";

export const createRoute = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { fromStationId, toStationId, distanceKm } = req.body;
    const agencyId = req.user?.agencyId as string;

    if (!fromStationId || !toStationId) {
      res.status(400).json({ message: "fromStationId and toStationId are required" });
      return;
    }

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const route = await createRouteService(
      { fromStationId, toStationId, distanceKm },
      agencyId
    );

    res.status(201).json({
      message: "Route created successfully",
      route,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAgencyRoutes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const routes = await getAgencyRoutesService(agencyId);
    res.status(200).json({ routes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRouteById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;

    const route = await getRouteByIdService(id, agencyId);
    res.status(200).json({ route });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateRoute = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;
    const { distanceKm } = req.body;

    const route = await updateRouteService(id, agencyId, { distanceKm });

    res.status(200).json({
      message: "Route updated successfully",
      route,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRoute = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;

    const result = await deleteRouteService(id, agencyId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};