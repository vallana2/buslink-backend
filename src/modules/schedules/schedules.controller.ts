import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  createScheduleService,
  getAgencySchedulesService,
  getScheduleByIdService,
  updateScheduleService,
  deleteScheduleService,
  searchSchedulesService,
} from "./schedules.service";

export const createSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { routeId, busId, driverId, departureTime, arrivalTime, price } = req.body;
    const agencyId = req.user?.agencyId as string;

    if (!routeId || !busId || !departureTime || price === undefined) {
      res.status(400).json({
        message: "routeId, busId, departureTime, and price are required",
      });
      return;
    }

    const schedule = await createScheduleService(
      { routeId, busId, driverId, departureTime, arrivalTime, price },
      agencyId
    );

    res.status(201).json({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAgencySchedules = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;

    const schedules = await getAgencySchedulesService(agencyId);
    res.status(200).json({ schedules });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const schedule = await getScheduleByIdService(id);
    res.status(200).json({ schedule });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;
    const { busId, driverId, departureTime, arrivalTime, price, status } = req.body;

    const schedule = await updateScheduleService(id, agencyId, {
      busId,
      driverId,
      departureTime,
      arrivalTime,
      price,
      status,
    });

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const agencyId = req.user?.agencyId as string;

    const result = await deleteScheduleService(id, agencyId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUBLIC — passenger search
export const searchSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fromCity = req.query.from as string | undefined;
    const toCity = req.query.to as string | undefined;
    const date = req.query.date as string | undefined;
    const agencyId = req.query.agencyId as string | undefined;
    const schedules = await searchSchedulesService({ fromCity, toCity, date, agencyId });
    res.status(200).json({ schedules });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};