import { Router } from "express";
import {
  createBus,
  getAgencyBuses,
  getBusById,
  updateBus,
  deleteBus,
} from "./buses.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// All routes require Agency Admin
router.post("/", authenticate, authorize("AGENCY_ADMIN"), createBus);
router.get("/", authenticate, authorize("AGENCY_ADMIN"), getAgencyBuses);
router.get("/:id", authenticate, authorize("AGENCY_ADMIN"), getBusById);
router.put("/:id", authenticate, authorize("AGENCY_ADMIN"), updateBus);
router.delete("/:id", authenticate, authorize("AGENCY_ADMIN"), deleteBus);

export default router;