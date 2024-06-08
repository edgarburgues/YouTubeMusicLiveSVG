const axios = require("axios");
const ColorThief = require("colorthief");
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

    const tempFilePath = path.join(__dirname, "temp_thumbnail.jpg");
    fs.writeFileSync(tempFilePath, buffer);

    const dominantColors = await ColorThief.getPalette(tempFilePath, 2);
    const dominantColor1Hex = rgbToHex(dominantColors[0]);
    const dominantColor2Hex = rgbToHex(dominantColors[1]);

    fs.unlinkSync(tempFilePath); // Elimina el archivo temporal después de su uso

    console.debug(`Dominant colors: ${dominantColor1Hex}, ${dominantColor2Hex}`);
    return { imgBase64Url, dominantColor1Hex, dominantColor2Hex };
  } catch (error) {
    console.error(`Error fetching image and palette: ${error.message}`);
    return { imgBase64Url: null, dominantColor1Hex: "#000000", dominantColor2Hex: "#000000" };
  }
}

function rgbToHex(color) {
  return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1)}`;
}

module.exports = {
  getFirstVideoFromHistory,
  getImageAndPalette,
};
