import axios from "axios";
import ColorThief from "colorthief";
import Jimp from "jimp";
import fs from "fs";
import path from "path";
import os from "os";

async function getImageAndPalette(thumbnailUrl: string) {
  try {
    const response = await axios.get(thumbnailUrl, {
      responseType: "arraybuffer",
      headers: { "user-agent": "Mozilla/5.0" }
    });
    const buffer = Buffer.from(response.data, "binary");
    const imgBase64Url = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    const image = await Jimp.read(buffer);
    const tmpFile = path.join(os.tmpdir(), `ytm_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
    await image.writeAsync(tmpFile);

    const palette = await (ColorThief as any).getPalette(tmpFile, 2);
    await fs.promises.unlink(tmpFile).catch(() => {});

    const [c1, c2] = Array.isArray(palette) && palette.length >= 2 ? palette : [[0, 0, 0], [32, 32, 32]];
    const dominantColor1Hex = rgbToHex(c1);
    const dominantColor2Hex = rgbToHex(c2);

    return { imgBase64Url, dominantColor1Hex, dominantColor2Hex };
  } catch {
    const fallbackSvg =
      "data:image/svg+xml;base64," +
      Buffer.from(
        `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
           <rect width="100%" height="100%" fill="#333"/>
           <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" dominant-baseline="middle" text-anchor="middle">Error</text>
         </svg>`
      ).toString("base64");
    return { imgBase64Url: fallbackSvg, dominantColor1Hex: "#000000", dominantColor2Hex: "#202020" };
  }
}

function rgbToHex(color: [number, number, number]): string {
  return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1)}`;
}

export { getImageAndPalette };