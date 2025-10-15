import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

const LOG_DIR = process.env.LOG_DIR || path.resolve(process.cwd(), "logs");

const transportList: any[] = [new transports.Console()];

try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  transportList.push(
    new transports.File({
      dirname: LOG_DIR,
      filename: "app.log",
      maxsize: 5_000_000,
      maxFiles: 2,
    })
  );
} catch {
  // Si no se puede crear el directorio, seguimos solo con consola
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
  ),
  transports: transportList,
});

export { logger };