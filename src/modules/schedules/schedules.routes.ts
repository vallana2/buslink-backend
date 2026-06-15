import { Router } from "express";
import {
  createSchedule,
  getAgencySchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  searchSchedules,
} from "./schedules.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// PUBLIC — passenger search (must come before /:id)
router.get("/search", searchSchedules);

// PUBLIC — view a single schedule
router.get("/:id", getScheduleById);

// AGENCY ADMIN — manage own schedules
router.post("/", authenticate, authorize("AGENCY_ADMIN"), createSchedule);
router.get("/", authenticate, authorize("AGENCY_ADMIN"), getAgencySchedules);
router.put("/:id", authenticate, authorize("AGENCY_ADMIN"), updateSchedule);
router.delete("/:id", authenticate, authorize("AGENCY_ADMIN"), deleteSchedule);

export default router;