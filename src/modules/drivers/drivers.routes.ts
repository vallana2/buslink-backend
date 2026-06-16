import { Router } from "express";
import {
  getAgencyDrivers,
  getMyTrips,
  getTripPassengers,
  updateTripStatus,
} from "./drivers.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// Agency Admin
router.get("/", authenticate, authorize("AGENCY_ADMIN"), getAgencyDrivers);

// Driver
router.get("/trips/my", authenticate, authorize("DRIVER"), getMyTrips);
router.get("/trips/:scheduleId/passengers", authenticate, authorize("DRIVER"), getTripPassengers);
router.patch("/trips/:scheduleId/status", authenticate, authorize("DRIVER"), updateTripStatus);

export default router;