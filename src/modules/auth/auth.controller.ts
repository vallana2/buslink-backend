import { Request, Response } from "express";
import { registerService, loginService } from "./auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const result = await registerService({ name, email, phone, password });

    res.status(201).json({
      message: "Account created successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await loginService({ email, password });

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};