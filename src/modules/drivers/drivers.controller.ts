import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  getAgencyDriversService,
  getMyTripsService,
  getTripPassengersService,
  updateTripStatusService,
} from "./drivers.service";

export const getAgencyDrivers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;
    const drivers = await getAgencyDriversService(agencyId);
    res.status(200).json({ drivers });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const driverUserId = req.user?.id as string;
    const trips = await getMyTripsService(driverUserId);
    res.status(200).json({ trips });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTripPassengers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scheduleId = req.params.scheduleId as string;
    const driverUserId = req.user?.id as string;

    const passengers = await getTripPassengersService(scheduleId, driverUserId);
    res.status(200).json({ passengers });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTripStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scheduleId = req.params.scheduleId as string;
    const driverUserId = req.user?.id as string;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "status is required" });
      return;
    }

    const schedule = await updateTripStatusService(scheduleId, driverUserId, status);

    res.status(200).json({ message: "Trip status updated", schedule });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};