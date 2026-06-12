import { Router } from "express";
import {
  createAgency,
  getAllAgencies,
  getAgencyById,
  updateAgency,
  approveAgency,
  linkAgencyToStation,
  getAgencyStations,
} from "./agencies.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// Public — anyone can view approved agencies
router.get("/", getAllAgencies);
router.get("/:id", getAgencyById);
router.get("/:id/stations", getAgencyStations);

// System Admin only
router.post("/", authenticate, authorize("SYSTEM_ADMIN"), createAgency);
router.put("/:id", authenticate, authorize("SYSTEM_ADMIN"), updateAgency);
router.patch("/:id/approve", authenticate, authorize("SYSTEM_ADMIN"), approveAgency);
router.post("/:id/stations", authenticate, authorize("SYSTEM_ADMIN"), linkAgencyToStation);

export default router;