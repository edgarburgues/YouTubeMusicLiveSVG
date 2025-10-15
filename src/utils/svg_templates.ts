import { escape } from "html-escaper";
import { logger } from "./logger.js";
import type { Response } from "express";

// Función para establecer headers anti-caché agresivos
function setAggressiveNoCacheHeaders(res: Response) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader("X-Accel-Expires", "0");
  res.setHeader("X-Timestamp", Date.now().toString());
}

function generateBarsSvg(color: string, barCount: number = 10, barSpeed: number = 1): string {
  logger.debug(`Generating bars SVG color=${color} bars=${barCount} speed=${barSpeed}`);
  const bars: string[] = [];
  for (let i = 0; i < barCount; i++) {
    const beginTime = (Math.random() * 1.5).toFixed(2);
    bars.push(
      `<rect x="${200 + i * 25}" y="170" width="20" height="0" fill="${color}">
         <animate attributeName="height" values="0;50;0" dur="${barSpeed}s" repeatCount="indefinite" begin="${beginTime}s"/>
         <animate attributeName="y" values="170;120;170" dur="${barSpeed}s" repeatCount="indefinite" begin="${beginTime}s"/>
       </rect>`
    );
  }
  return bars.join("\n");
}

function truncate(input: string, max: number, tail = "...") {
  return input.length > max ? input.slice(0, Math.max(0, max - tail.length)) + tail : input;
}

function generateSvgContent(
  title: string,
  author: string,
  imgBase64Url: string,
  color1: string,
  color2: string,
  barCount: number = 12,
  barSpeed: number = 0.8
): string {
  logger.debug(`Generating SVG content`);
  const t = truncate(title, 24);
  const a = truncate(author, 32);
  const cacheBust = Date.now();

  // Generar barras de ecualizador mejoradas
  const bars: string[] = [];
  for (let i = 0; i < barCount; i++) {
    const x = 200 + i * 21;
    const delay = (Math.random() * 1.2).toFixed(2);
    const height1 = Math.floor(Math.random() * 30 + 20);
    const height2 = Math.floor(Math.random() * 40 + 30);
    const height3 = Math.floor(Math.random() * 25 + 15);
    
    bars.push(
      `<rect x="${x}" y="170" width="16" height="0" fill="${color1}" rx="2" opacity="0.9">
         <animate attributeName="height" values="0;${height1};${height2};${height3};0" dur="${barSpeed}s" repeatCount="indefinite" begin="${delay}s"/>
         <animate attributeName="y" values="170;${170-height1};${170-height2};${170-height3};170" dur="${barSpeed}s" repeatCount="indefinite" begin="${delay}s"/>
       </rect>`
    );
  }

  return `
<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg" data-cache-bust="${cacheBust}">
  <defs>
    <!-- Gradiente principal más vibrante -->
    <linearGradient id="bgGrad-${cacheBust}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color2};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:${color1};stop-opacity:0.8" />
    </linearGradient>
    
    <!-- Overlay brillante -->
    <linearGradient id="shineGrad-${cacheBust}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:white;stop-opacity:0" />
    </linearGradient>
    
    <!-- Sombra más suave -->
    <filter id="shadow-${cacheBust}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="3" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Sombra para la imagen -->
    <filter id="imageShadow-${cacheBust}">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.6"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Máscara redondeada para la imagen -->
    <mask id="imgMask-${cacheBust}">
      <rect x="20" y="20" width="160" height="160" rx="12" ry="12" fill="white"/>
    </mask>
    
    <!-- Gradiente para borde brillante de la imagen -->
    <linearGradient id="borderGrad-${cacheBust}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:white;stop-opacity:0.1" />
    </linearGradient>
  </defs>
  
  <!-- Fondo con gradiente -->
  <rect width="100%" height="100%" fill="url(#bgGrad-${cacheBust})" rx="16" ry="16"/>
  
  <!-- Overlay brillante sutil -->
  <rect width="100%" height="100%" fill="url(#shineGrad-${cacheBust})" rx="16" ry="16"/>
  
  <!-- Decoración circular de fondo -->
  <circle cx="450" cy="30" r="60" fill="white" opacity="0.05"/>
  <circle cx="480" cy="180" r="40" fill="white" opacity="0.03"/>
  
  <!-- Sombra de la imagen -->
  <rect x="20" y="20" width="160" height="160" rx="12" ry="12" fill="black" opacity="0.2" filter="url(#imageShadow-${cacheBust})"/>
  
  <!-- Imagen del álbum -->
  <image href="${imgBase64Url}" x="20" y="20" height="160" width="160" mask="url(#imgMask-${cacheBust})" preserveAspectRatio="xMidYMid slice"/>
  
  <!-- Borde brillante sobre la imagen -->
  <rect x="20" y="20" width="160" height="160" rx="12" ry="12" fill="none" stroke="url(#borderGrad-${cacheBust})" stroke-width="2" opacity="0.6"/>
  
  <!-- Línea decorativa -->
  <line x1="200" y1="115" x2="475" y2="115" stroke="white" stroke-width="1" opacity="0.15"/>
  
  <!-- Título de la canción -->
  <text x="205" y="65" font-family="'Segoe UI', Arial, sans-serif" font-size="26" font-weight="600" fill="white" filter="url(#shadow-${cacheBust})">
    ${escape(t)}
  </text>
  
  <!-- Artista -->
  <text x="205" y="95" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="400" fill="white" opacity="0.9" filter="url(#shadow-${cacheBust})">
    ${escape(a)}
  </text>
  
  <!-- Barras de ecualizador mejoradas -->
  ${bars.join("\n  ")}
  
  <!-- Icono de reproducción animado -->
  <g transform="translate(200, 130)">
    <circle cx="12" cy="12" r="12" fill="white" opacity="0.2">
      <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
    </circle>
    <polygon points="9,7 9,17 17,12" fill="white" opacity="0.9"/>
  </g>
  
  <!-- Texto "NOW PLAYING" -->
  <text x="230" y="142" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="600" fill="white" opacity="0.7" letter-spacing="1">
    NOW PLAYING
  </text>
</svg>`;
}

function generateSvgContentVertical(
  title: string,
  author: string,
  imgBase64Url: string,
  color1: string,
  color2: string,
  barCount: number = 5,
  barSpeed: number = 1
): string {
  logger.debug(`Generating vertical SVG content`);
  const barsSvg = generateBarsSvg(color1, barCount, barSpeed);
  const t = truncate(title, 16);
  const a = truncate(author, 21);
  const cacheBust = Date.now();

  return `
<svg width="200" height="250" xmlns="http://www.w3.org/2000/svg" data-cache-bust="${cacheBust}">
  <defs>
    <linearGradient id="grad1-${cacheBust}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow-${cacheBust}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <mask id="mask-${cacheBust}">
      <rect x="25" y="25" width="150" height="150" rx="5" ry="5" fill="white"/>
    </mask>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1-${cacheBust})" rx="15" ry="15"/>
  <image href="${imgBase64Url}" x="25" y="25" height="150" width="150" mask="url(#mask-${cacheBust})"/>
  <text x="100" y="200" font-family="Arial" font-size="20" fill="white" filter="url(#shadow-${cacheBust})" text-anchor="middle">${escape(t)}</text>
  <text x="100" y="230" font-family="Arial" font-size="16" fill="white" filter="url(#shadow-${cacheBust})" text-anchor="middle">${escape(a)}</text>
  ${barsSvg}
</svg>`;
}

function generateRotatingVinylSvg(
  song: string,
  author: string,
  thumbnail: string,
  color1: string,
  color2: string,
  barCount: number = 10,
  barSpeed: number = 1
): string {
  logger.debug(`Generating rotating vinyl SVG`);
  const barsSvg = generateBarsSvg(color1, barCount, barSpeed);
  const s = truncate(song, 22);
  const a = truncate(author, 30);
  const cacheBust = Date.now();

  return `
<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg" data-cache-bust="${cacheBust}">
  <defs>
    <linearGradient id="grad1-${cacheBust}" x1="0%" y1="0%" x2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow-${cacheBust}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="image-${cacheBust}" patternUnits="userSpaceOnUse" width="150" height="150">
      <image href="${thumbnail}" x="0" y="0" width="150" height="150" preserveAspectRatio="xMidYMid slice"/>
    </pattern>
    <mask id="mask-${cacheBust}">
      <circle cx="75" cy="75" r="75" fill="white"/>
    </mask>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1-${cacheBust})" rx="15" ry="15"/>
  <g transform="translate(25,25)">
    <circle cx="75" cy="75" r="75" fill="url(#image-${cacheBust})" mask="url(#mask-${cacheBust})">
      <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="75" cy="75" r="25" fill="white" fill-opacity="0.5"/>
    <line x1="75" y1="0" x2="75" y2="50" stroke="white" stroke-width="2" stroke-opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="5s" repeatCount="indefinite"/>
    </line>
    <circle cx="75" cy="75" r="5" fill="black"/>
  </g>
  <text x="200" y="70" font-family="Arial" font-size="24" fill="white" filter="url(#shadow-${cacheBust})">${escape(s)}</text>
  <text x="200" y="100" font-family="Arial" font-size="18" fill="white" filter="url(#shadow-${cacheBust})">${escape(a)}</text>
  ${barsSvg}
</svg>`;
}

export { generateSvgContent, generateSvgContentVertical, generateRotatingVinylSvg, setAggressiveNoCacheHeaders };