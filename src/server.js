const express = require("express");
const YTMusic = require("./ytmusic/ytmusic");
const { getFirstVideoFromHistory, getImageAndPalette } = require("./utils/utils");
const { generateSvgContent, generateSvgContentVertical } = require("./utils/svg_templates");
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
    res.status(500).json({ error: "Error retrieving history", details: error.message });
  }
});

app.get("/api/svg", async (req, res) => {
  try {
    logger.debug("Received request for /api/svg");
    const barCount = parseInt(req.query.bar_count) || 10;
    const barSpeed = parseFloat(req.query.bar_speed) || 1;

    const firstVideo = await getFirstVideoFromHistory(ytmusic);
    if (firstVideo) {
      const { title, author, thumbnail: thumbnailUrl } = firstVideo;
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(thumbnailUrl);
      const svgContent = generateSvgContent(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex, barCount, barSpeed);
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
    logger.error(`Error in /api/svg: ${error.message}`);
    res.status(500).json({ error: "Error generating SVG", details: error.message });
  }
});

app.get("/api/svg-vertical", async (req, res) => {
  try {
    logger.debug("Received request for /api/svg-vertical");
    const barCount = parseInt(req.query.bar_count) || 5;
    const barSpeed = parseFloat(req.query.bar_speed) || 1;

    const firstVideo = await getFirstVideoFromHistory(ytmusic);
    if (firstVideo) {
      const { title, author, thumbnail: thumbnailUrl } = firstVideo;
      const { imgBase64Url, dominantColor1Hex, dominantColor2Hex } = await getImageAndPalette(thumbnailUrl);
      const svgContent = generateSvgContentVertical(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex, barCount, barSpeed);
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
          <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#333" />
              <text x="100" y="125" font-family="Arial" font-size="24" fill="white" text-anchor="middle">No song playing</text>
          </svg>
      `);
    }
  } catch (error) {
    logger.error(`Error in /api/svg-vertical: ${error.message}`);
    res.status(500).json({ error: "Error generating SVG", details: error.message });
  }
});

app.listen(port, () => {
  logger.info(`Servidor corriendo en http://localhost:${port}`);
});
