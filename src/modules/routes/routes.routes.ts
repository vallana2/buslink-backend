import { Router } from "express";
import {
  createRoute,
  getAgencyRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from "./routes.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// All routes require Agency Admin
router.post("/", authenticate, authorize("AGENCY_ADMIN"), createRoute);
router.get("/", authenticate, authorize("AGENCY_ADMIN"), getAgencyRoutes);
router.get("/:id", authenticate, authorize("AGENCY_ADMIN"), getRouteById);
router.put("/:id", authenticate, authorize("AGENCY_ADMIN"), updateRoute);
router.delete("/:id", authenticate, authorize("AGENCY_ADMIN"), deleteRoute);

export default router;