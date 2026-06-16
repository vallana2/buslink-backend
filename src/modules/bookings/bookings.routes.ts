import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAgencyBookings,
} from "./bookings.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// PASSENGER
router.post("/", authenticate, authorize("PASSENGER"), createBooking);
router.get("/my", authenticate, authorize("PASSENGER"), getMyBookings);
router.get("/:id", authenticate, authorize("PASSENGER"), getBookingById);
router.patch("/:id/cancel", authenticate, authorize("PASSENGER"), cancelBooking);

// AGENCY ADMIN
router.get("/agency/all", authenticate, authorize("AGENCY_ADMIN"), getAgencyBookings);

export default router;