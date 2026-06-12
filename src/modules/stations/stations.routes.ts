import { Router } from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "./stations.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// Public — anyone can get stations
router.get("/", getAllStations);
router.get("/:id", getStationById);

// System Admin only
router.post("/", authenticate, authorize("SYSTEM_ADMIN"), createStation);
router.put("/:id", authenticate, authorize("SYSTEM_ADMIN"), updateStation);
router.delete("/:id", authenticate, authorize("SYSTEM_ADMIN"), deleteStation);

export default router;