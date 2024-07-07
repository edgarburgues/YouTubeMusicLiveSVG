import type { Request, Response } from "express";
import { YTMusic } from "../ytmusic/ytmusic";
import { logger } from "../utils/logger";
import { generateSvgContent, generateSvgContentVertical, generateRotatingVinylSvg } from "../utils/svg_templates";
import { getImageAndPalette } from "../utils/utils";
import { setNoCacheHeaders } from "../utils/cacheHeaders";

const ytmusic = new YTMusic();

class YTMusicController {
  static async getHistory(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.json(history);
    } catch (error: any) {
      logger.error(`Error fetching history: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getFirstVideoFromHistory(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      if (history.length > 0) {
        const firstVideo = history[0];
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.json(firstVideo);
      } else {
        res.status(404).json({ error: "No video found in history" });
      }
    } catch (error: any) {
      logger.error(`Error fetching first video from history: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getSvg(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      if (history.length > 0) {
        const firstVideo = history[0];
        const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(firstVideo.thumbnail);
        const svgContent = generateSvgContent(firstVideo.song, firstVideo.author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.send(svgContent);
      } else {
        res.status(404).json({ error: "No video found in history" });
      }
    } catch (error: any) {
      logger.error(`Error generating SVG: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getSvgVertical(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      if (history.length > 0) {
        const firstVideo = history[0];
        const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(firstVideo.thumbnail);
        const svgContent = generateSvgContentVertical(firstVideo.song, firstVideo.author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
        res.setHeader("Content-Type", "image/svg+xml");
        setNoCacheHeaders(res);
        res.send(svgContent);
      } else {
        res.status(404).json({ error: "No video found in history" });
      }
    } catch (error: any) {
      logger.error(`Error generating vertical SVG: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getSvgVinyl(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      if (history.length > 0) {
        const firstVideo = history[0];
        const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(firstVideo.thumbnail);
        const svgContent = generateRotatingVinylSvg(firstVideo.song, firstVideo.author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.send(svgContent);
      } else {
        res.status(404).json({ error: "No video found in history" });
      }
    } catch (error: any) {
      logger.error(`Error generating vinyl SVG: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export { YTMusicController };
