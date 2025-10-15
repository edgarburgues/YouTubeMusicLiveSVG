import type { Request, Response } from "express";
import { YTMusic } from "../ytmusic/ytmusic.js";
import { logger } from "../utils/logger.js";
import { generateSvgContent, generateSvgContentVertical, generateRotatingVinylSvg, setAggressiveNoCacheHeaders } from "../utils/svg_templates.js";
import { getImageAndPalette } from "../utils/utils.js";

const ytmusic = new YTMusic();

class YTMusicController {
  static async getHistory(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      setAggressiveNoCacheHeaders(res);
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
        setAggressiveNoCacheHeaders(res);
        res.json(history[0]);
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
      if (history.length === 0) return res.status(404).json({ error: "No video found in history" });

      const first = history[0];
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(first.thumbnail);
      const svgContent = generateSvgContent(first.song, first.author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
      
      res.setHeader("Content-Type", "image/svg+xml");
      setAggressiveNoCacheHeaders(res);
      res.send(svgContent);
    } catch (error: any) {
      logger.error(`Error generating SVG: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getSvgVertical(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      if (history.length === 0) return res.status(404).json({ error: "No video found in history" });

      const first = history[0];
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(first.thumbnail);
      const svgContent = generateSvgContentVertical(first.song, first.author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
      
      res.setHeader("Content-Type", "image/svg+xml");
      setAggressiveNoCacheHeaders(res);
      res.send(svgContent);
    } catch (error: any) {
      logger.error(`Error generating vertical SVG: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getSvgVinyl(req: Request, res: Response) {
    try {
      const history = await ytmusic.getHistory();
      if (history.length === 0) return res.status(404).json({ error: "No video found in history" });

      const first = history[0];
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(first.thumbnail);
      const svgContent = generateRotatingVinylSvg(first.song, first.author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
      
      res.setHeader("Content-Type", "image/svg+xml");
      setAggressiveNoCacheHeaders(res);
      res.send(svgContent);
    } catch (error: any) {
      logger.error(`Error generating vinyl SVG: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export { YTMusicController };