const express = require("express");
const YTMusic = require("./ytmusic/ytmusic");
const { getImageAndPalette } = require("./utils/utils");
const { generateSvgContent, generateSvgContentVertical, generateRotatingVinylSvg } = require("./utils/svg_templates");
const { logger } = require("./utils/logger");
const app = express();
const port = 3000;

const ytmusic = new YTMusic();

app.get("/api/history", async (req, res) => {
  try {
    logger.debug("Received request for /api/history");
    const history = await ytmusic.getHistory();
    res.json(history);
  } catch (error) {
    logger.error(`Error in /api/history: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

async function handleSvgRequest(req, res, isVertical) {
  try {
    logger.debug(`Received request for /api/svg${isVertical ? "-vertical" : ""}`);
    const barCount = parseInt(req.query.bar_count) || (isVertical ? 5 : 10);
    const barSpeed = parseFloat(req.query.bar_speed) || 1;

    const history = await ytmusic.getHistory();
    if (history && history.length > 0) {
      const firstVideo = history[0];
      const { song: title, author, thumbnail: thumbnailUrl } = firstVideo;
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(thumbnailUrl);
      const svgContent = isVertical
        ? generateSvgContentVertical(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex, barCount, barSpeed)
        : generateSvgContent(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex, barCount, barSpeed);
      res.set("Content-Type", "image/svg+xml");
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.send(svgContent);
    } else {
      logger.debug("No video found in history");
      res.set("Content-Type", "image/svg+xml");
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.send(`
        <svg width="${isVertical ? 200 : 500}" height="${isVertical ? 250 : 200}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#333" />
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">No song playing</text>
        </svg>
      `);
    }
  } catch (error) {
    logger.error(`Error in /api/svg${isVertical ? "-vertical" : ""}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

async function handleVinylSvgRequest(req, res) {
  try {
    logger.debug(`Received request for /api/svg-vinyl`);

    const history = await ytmusic.getHistory();
    if (history && history.length > 0) {
      const firstVideo = history[0];
      const { song: title, author, thumbnail: thumbnailUrl } = firstVideo;
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(thumbnailUrl);
      const svgContent = generateRotatingVinylSvg(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex);
      res.set("Content-Type", "image/svg+xml");
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.send(svgContent);
    } else {
      logger.debug("No video found in history");
      res.set("Content-Type", "image/svg+xml");
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.send(`
        <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#333" />
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">No song playing</text>
        </svg>
      `);
    }
  } catch (error) {
    logger.error(`Error in /api/svg-vinyl: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

app.get("/api/svg", async (req, res) => {
  await handleSvgRequest(req, res, false);
});

app.get("/api/svg-vertical", async (req, res) => {
  await handleSvgRequest(req, res, true);
});

app.get("/api/svg-vinyl", async (req, res) => {
  await handleVinylSvgRequest(req, res);
});

app.listen(port, () => {
  logger.info(`Servidor corriendo en http://localhost:${port}`);
});
