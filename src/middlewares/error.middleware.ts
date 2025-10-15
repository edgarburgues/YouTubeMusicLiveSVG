import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err?.stack || err?.message || String(err));
  res.status(500).json({ error: "Internal Server Error" });
}

export { errorHandler };