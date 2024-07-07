import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
}

export { errorHandler };
