import { Router } from "express";
import { register, login } from "./auth.controller";

const router = Router();

router.post("/register", register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login (all roles)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

export default router;