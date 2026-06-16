import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  chatbotService,
  predictDemandService,
  predictDelayService,
  checkFraudService,
} from "./ai.service";

export const chatbot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ message: "message is required" });
      return;
    }

    const reply = await chatbotService(message);
    res.status(200).json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const predictDemand = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const routeId = req.query.routeId as string;

    if (!routeId) {
      res.status(400).json({ message: "routeId is required" });
      return;
    }

    const prediction = await predictDemandService(routeId);
    res.status(200).json({ prediction });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const predictDelay = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scheduleId = req.query.scheduleId as string;

    if (!scheduleId) {
      res.status(400).json({ message: "scheduleId is required" });
      return;
    }

    const prediction = await predictDelayService(scheduleId);
    res.status(200).json({ prediction });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const checkFraud = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400).json({ message: "bookingId is required" });
      return;
    }

    const result = await checkFraudService(bookingId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};