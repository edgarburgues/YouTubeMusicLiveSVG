const axios = require("axios");
const ColorThief = require("colorthief");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

async function getFirstVideoFromHistory(ytmusic) {
  console.debug("Fetching first video from history...");
  try {
    const history = await ytmusic.getHistory();
    if (history) {
      console.debug(`Found video: ${history.song} by ${history.author}`);
      return {
        title: history.song,
        thumbnail: history.thumbnail,
        author: history.author,
      };
    } else {
      console.debug("No history found");
      return null;
    }
  } catch (error) {
    console.error(`Error fetching video history: ${error.message}`);
    return null;
  }
}

async function getImageAndPalette(thumbnailUrl) {
  console.debug(`Fetching image and palette for thumbnail: ${thumbnailUrl}`);
  try {
    const response = await axios.get(thumbnailUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    const imgBase64Url = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    const image = await Jimp.read(buffer);

    const tempFilePath = path.join(__dirname, "/temp/temp_image.png");
    await image.writeAsync(tempFilePath);

    const dominantColors = await ColorThief.getPalette(tempFilePath, 2);
    await fs.promises.unlink(tempFilePath);

    const dominantColor1Hex = rgbToHex(dominantColors[0]);
    const dominantColor2Hex = rgbToHex(dominantColors[1]);

    console.debug(`Dominant colors: ${dominantColor1Hex}, ${dominantColor2Hex}`);
    return { imgBase64Url, dominantColor1Hex, dominantColor2Hex };
  } catch (error) {
    console.error(`Error fetching image and palette: ${error.message}`);
    // Fallback colors and image
    const imgBase64Url =
      "data:image/svg+xml;base64," +
      Buffer.from(
        `
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#333" />
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Error</text>
      </svg>
    `
      ).toString("base64");
    return { imgBase64Url, dominantColor1Hex: "#000000", dominantColor2Hex: "#000000" };
  }
}

function rgbToHex(color) {
  return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1)}`;
}

module.exports = {
  getFirstVideoFromHistory,
  getImageAndPalette,
};
