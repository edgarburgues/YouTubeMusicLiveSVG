import { Router } from "express";
import { YTMusicController } from "../controllers/ytmusic.controller.js";

const router = Router();

router.get("/history", YTMusicController.getHistory);
router.get("/history/first", YTMusicController.getFirstVideoFromHistory);
router.get("/svg", YTMusicController.getSvg);
router.get("/svg-vertical", YTMusicController.getSvgVertical);
router.get("/svg-vinyl", YTMusicController.getSvgVinyl);

export { router as ytmusicRouter };