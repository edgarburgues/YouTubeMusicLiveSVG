const html = require("html-escaper");
const random = require("random");

function generateBarsSvg(dominantColor1Hex, barCount = 10, barSpeed = 1) {
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
  const barsSvg = generateBarsSvg(dominantColor1Hex, barCount, barSpeed);

  if (title.length > 19) {
    title = title.slice(0, 19) + "...";
  }

  if (author.length > 30) {
    author = author.slice(0, 28) + "...";
  }

  return `
    <!-- Hecho por @edgarburgues -->
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
  const barsSvg = generateBarsSvg(dominantColor1Hex, barCount, barSpeed);

  if (title.length > 16) {
    title = title.slice(0, 14) + "...";
  }

  if (author.length > 21) {
    author = author.slice(0, 19) + "...";
  }

  return `
    <!-- Hecho por @edgarburgues -->
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

module.exports = {
  generateSvgContent,
  generateSvgContentVertical,
};
