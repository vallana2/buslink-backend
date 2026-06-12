import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";

const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};

export default authorize;