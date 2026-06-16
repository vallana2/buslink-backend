import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import { payWithMobileMoneyService, payWithCardService } from "./payments.service";

export const payWithMobileMoney = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, phone, amount, provider } = req.body;
    const passengerId = req.user?.id as string;

    if (!bookingId || !phone || !amount || !provider) {
      res.status(400).json({ message: "bookingId, phone, amount, provider are required" });
      return;
    }

    const result = await payWithMobileMoneyService(bookingId, passengerId, { phone, amount, provider });

    res.status(200).json({ message: "Payment successful", ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const payWithCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, amount, cardNumber } = req.body;
    const passengerId = req.user?.id as string;

    if (!bookingId || !amount || !cardNumber) {
      res.status(400).json({ message: "bookingId, amount, cardNumber are required" });
      return;
    }

    const result = await payWithCardService(bookingId, passengerId, { amount, cardNumber });

    res.status(200).json({ message: "Payment successful", ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};