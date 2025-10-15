import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { ytmusicRouter } from "./src/routes/ytmusic.router.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import { logger } from "./src/utils/logger.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", ytmusicRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Servidor escuchando en el puerto ${port}`);
});