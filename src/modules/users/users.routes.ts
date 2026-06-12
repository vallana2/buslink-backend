import { Router } from "express";
import {
  createAgencyAdmin,
  createDriver,
  getAllUsers,
  getProfile,
} from "./users.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

// System Admin creates agency admin
router.post(
  "/agency-admin",
  authenticate,
  authorize("SYSTEM_ADMIN"),
  createAgencyAdmin
);

// Agency Admin creates driver
router.post(
  "/driver",
  authenticate,
  authorize("AGENCY_ADMIN"),
  createDriver
);

// System Admin gets all users
router.get(
  "/",
  authenticate,
  authorize("SYSTEM_ADMIN"),
  getAllUsers
);

// Any logged in user gets their own profile
router.get(
  "/profile",
  authenticate,
  getProfile
);

export default router;