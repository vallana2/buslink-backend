import { Router } from "express";
import { payWithMobileMoney, payWithCard } from "./payments.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

router.post("/mobile-money", authenticate, authorize("PASSENGER"), payWithMobileMoney);
router.post("/card", authenticate, authorize("PASSENGER"), payWithCard);

export default router;