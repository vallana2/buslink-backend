import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  createBookingService,
  getMyBookingsService,
  getBookingByIdService,
  cancelBookingService,
  getAgencyBookingsService,
} from "./bookings.service";

export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { scheduleId } = req.body;
    const passengerId = req.user?.id as string;

    if (!scheduleId) {
      res.status(400).json({ message: "scheduleId is required" });
      return;
    }

    const booking = await createBookingService(scheduleId, passengerId);

    res.status(201).json({
      message: "Booking created successfully. Proceed to payment.",
      booking,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const passengerId = req.user?.id as string;
    const bookings = await getMyBookingsService(passengerId);
    res.status(200).json({ bookings });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const passengerId = req.user?.id as string;

    const booking = await getBookingByIdService(id, passengerId);
    res.status(200).json({ booking });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const cancelBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const passengerId = req.user?.id as string;

    const booking = await cancelBookingService(id, passengerId);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAgencyBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;
    const bookings = await getAgencyBookingsService(agencyId);
    res.status(200).json({ bookings });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};