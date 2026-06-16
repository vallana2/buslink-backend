import { Router } from "express";
import { getMyTicket, validateTicket } from "./tickets.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

router.get("/:bookingId", authenticate, authorize("PASSENGER"), getMyTicket);
router.post("/validate", authenticate, authorize("DRIVER"), validateTicket);

export default router;