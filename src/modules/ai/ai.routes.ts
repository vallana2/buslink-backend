import { Router } from "express";
import { chatbot, predictDemand, predictDelay, checkFraud } from "./ai.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

router.post("/chat", authenticate, authorize("PASSENGER"), chatbot);
router.get("/predict-demand", authenticate, authorize("AGENCY_ADMIN"), predictDemand);
router.get("/predict-delay", authenticate, predictDelay);
router.post("/check-fraud", authenticate, authorize("SYSTEM_ADMIN"), checkFraud);

export default router;