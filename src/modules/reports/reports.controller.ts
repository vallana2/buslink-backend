import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import {
  getBookingReportService,
  getRevenueReportService,
  getPlatformOverviewService,
} from "./reports.service";

export const getBookingReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const report = await getBookingReportService(agencyId, startDate, endDate);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agencyId = req.user?.agencyId as string;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const report = await getRevenueReportService(agencyId, startDate, endDate);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlatformOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const overview = await getPlatformOverviewService();
    res.status(200).json(overview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};