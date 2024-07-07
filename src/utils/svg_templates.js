const html = require("html-escaper");
const { logger } = require("./logger");

function generateBarsSvg(dominantColor1Hex, barCount = 10, barSpeed = 1) {
  logger.debug(`Generating bars SVG with color: ${dominantColor1Hex}, barCount: ${barCount}, barSpeed: ${barSpeed}`);
  let bars = [];
  for (let i = 0; i < barCount; i++) {
    let beginTime = (Math.random() * 1.5).toFixed(2);
    bars.push(`
      <rect x="${200 + i * 25}" y="170" width="20" height="0" fill="${dominantColor1Hex}">
        <animate attributeName="height" values="0;50;0" dur="${barSpeed}s" repeatCount="indefinite" begin="${beginTime}s"/>
        <animate attributeName="y" values="170;120;170" dur="${barSpeed}s" repeatCount="indefinite" begin="${beginTime}s"/>
      </rect>
    `);
  }
  return bars.join("\n");
}

function generateSvgContent(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex, barCount = 10, barSpeed = 1) {
  logger.debug(`Generating SVG content for title: ${title}, author: ${author}`);
  const barsSvg = generateBarsSvg(dominantColor1Hex, barCount, barSpeed);

  if (title.length > 19) {
    title = title.slice(0, 19) + "...";
  }

  if (author.length > 30) {
    author = author.slice(0, 28) + "...";
  }

  return `
    <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${dominantColor1Hex};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${dominantColor2Hex};stop-opacity:1" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="2" dy="2" result="offsetblur"/>
                <feMerge> 
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <mask id="mask">
                <rect x="25" y="25" width="150" height="150" rx="5" ry="5" fill="white"/>
            </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" rx="15" ry="15"/>
        <image href="${imgBase64Url}" x="25" y="25" height="150" width="150" mask="url(#mask)"/>
        <text x="200" y="70" font-family="Arial" font-size="24" fill="white" filter="url(#shadow)">${html.escape(title)}</text>
        <text x="200" y="100" font-family="Arial" font-size="18" fill="white" filter="url(#shadow)">${html.escape(author)}</text>
        ${barsSvg}
    </svg>
  `;
}

function generateSvgContentVertical(title, author, imgBase64Url, dominantColor1Hex, dominantColor2Hex, barCount = 5, barSpeed = 1) {
  logger.debug(`Generating vertical SVG content for title: ${title}, author: ${author}`);
  const barsSvg = generateBarsSvg(dominantColor1Hex, barCount, barSpeed);

  if (title.length > 16) {
    title = title.slice(0, 14) + "...";
  }

  if (author.length > 21) {
    author = author.slice(0, 19) + "...";
  }

  return `
    <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${dominantColor1Hex};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${dominantColor2Hex};stop-opacity:1" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="2" dy="2" result="offsetblur"/>
                <feMerge> 
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <mask id="mask">
                <rect x="25" y="25" width="150" height="150" rx="5" ry="5" fill="white"/>
            </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" rx="15" ry="15"/>
        <image href="${imgBase64Url}" x="25" y="25" height="150" width="150" mask="url(#mask)"/>
        <text x="100" y="200" font-family="Arial" font-size="20" fill="white" filter="url(#shadow)" text-anchor="middle">${html.escape(title)}</text>
        <text x="100" y="230" font-family="Arial" font-size="16" fill="white" filter="url(#shadow)" text-anchor="middle">${html.escape(author)}</text>
        ${barsSvg}
    </svg>
  `;
}

function generateRotatingVinylSvg(song, author, thumbnail, color1, color2, barCount = 10, barSpeed = 1) {
  logger.debug(`Generating rotating vinyl SVG for song: ${song}, author: ${author}`);
  const barsSvg = generateBarsSvg(color1, barCount, barSpeed);

  if (song.length > 19) {
    song = song.slice(0, 19) + "...";
  }

  if (author.length > 30) {
    author = author.slice(0, 28) + "...";
  }

  return `
    <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <pattern id="image" patternUnits="userSpaceOnUse" width="150" height="150">
          <image href="${thumbnail}" x="0" y="0" width="150" height="150" preserveAspectRatio="xMidYMid slice"/>
        </pattern>
        <mask id="mask">
          <circle cx="75" cy="75" r="75" fill="white"/>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" rx="15" ry="15"/>
      <g transform="translate(25,25)">
        <circle cx="75" cy="75" r="75" fill="url(#image)" mask="url(#mask)">
          <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="75" cy="75" r="25" fill="white" fill-opacity="0.5"/>
        <line x1="75" y1="0" x2="75" y2="50" stroke="white" stroke-width="2" stroke-opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="5s" repeatCount="indefinite"/>
        </line>
        <circle cx="75" cy="75" r="5" fill="black"/>
      </g>
      <text x="200" y="70" font-family="Arial" font-size="24" fill="white" filter="url(#shadow)">${html.escape(song)}</text>
      <text x="200" y="100" font-family="Arial" font-size="18" fill="white" filter="url(#shadow)">${html.escape(author)}</text>
      ${barsSvg}
    </svg>
  `;
}

module.exports = {
  generateSvgContent,
  generateSvgContentVertical,
  generateRotatingVinylSvg,
};
