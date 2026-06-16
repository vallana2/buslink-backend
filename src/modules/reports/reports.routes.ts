import { Router } from "express";
import { getBookingReport, getRevenueReport, getPlatformOverview } from "./reports.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// Agency Admin
router.get("/bookings", authenticate, authorize("AGENCY_ADMIN"), getBookingReport);
router.get("/revenue", authenticate, authorize("AGENCY_ADMIN"), getRevenueReport);

// System Admin
router.get("/platform-overview", authenticate, authorize("SYSTEM_ADMIN"), getPlatformOverview);

export default router;