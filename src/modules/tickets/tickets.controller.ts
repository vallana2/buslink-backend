import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import { getMyTicketService, validateTicketService } from "./tickets.service";

export const getMyTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;
    const passengerId = req.user?.id as string;

    const ticket = await getMyTicketService(bookingId, passengerId);
    res.status(200).json({ ticket });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const validateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { qrCode } = req.body;
    const driverUserId = req.user?.id as string;

    if (!qrCode) {
      res.status(400).json({ message: "qrCode is required" });
      return;
    }

    const result = await validateTicketService(qrCode, driverUserId);

    res.status(200).json({
      valid: true,
      message: "Ticket valid — passenger may board",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ valid: false, message: error.message });
  }
};