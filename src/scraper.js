// src/scraper.js
// Usa Puppeteer para interceptar la URL m3u8 que genera el player JS
// y reemplaza la IP con la del cliente que hace el request a Stremio

const puppeteer = require('puppeteer');

// Cache para no hacer scraping en cada request
// { streamName: { url, fetchedAt } }
const urlCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos (los tokens suelen durar ~1h)

/**
 * Mapeo de ID de canal → parámetro ?stream= del sitio fuente
 */
const STREAM_MAP = {
  live:               'dsports',
  live_canal1:        'espnpremium',
  live_canal2:        'tntsports',
  live_canal3:        'tycsports',
  live_fox_sports_arg:'fox1ar',
  // Agregá más acá a medida que los vayas usando
};

/**
 * Lanza Puppeteer, carga la página y captura la primera URL .m3u8
 * que el player dispara como request de red.
 */
async function scrapeM3U8(streamName) {
  const pageUrl = `https://streamtp-abc.net/global1.php?stream=${streamName}`;
  console.log(`   🌐 Scrapeando: ${pageUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // necesario en entornos con poca RAM (VPS, Docker)
    ],
  });

  try {
    const page = await browser.newPage();

    // Interceptamos todos los requests de red de la página
    await page.setRequestInterception(true);

    let resolveM3U8;
    let rejectM3U8;
    const m3u8Promise = new Promise((res, rej) => {
      resolveM3U8 = res;
      rejectM3U8 = rej;
    });

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('.m3u8')) {
        console.log(`   ✅ m3u8 interceptado: ${url}`);
        resolveM3U8(url);
        // Abortamos el request para no descargar el stream
        request.abort();
      } else {
        request.continue();
      }
    });

    // Timeout de 15s si el player no dispara ningún .m3u8
    const timeout = setTimeout(() => rejectM3U8(new Error('Timeout: no se encontró m3u8')), 15000);

    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 20000 });

    const m3u8Url = await m3u8Promise;
    clearTimeout(timeout);

    return m3u8Url;
  } finally {
    await browser.close();
  }
}

/**
 * Devuelve la URL m3u8 con la IP del cliente inyectada.
 * Usa cache para no re-scrapear si el token sigue vigente.
 * 
 * @param {string} channelId  - ID del canal (ej: 'live_canal2')
 * @param {string} clientIP   - IP pública del cliente Stremio
 */
async function getM3U8WithClientIP(channelId, clientIP) {
  const streamName = STREAM_MAP[channelId];
  if (!streamName) {
    console.log(`   ❌ Canal sin mapeo de scraping: ${channelId}`);
    return null;
  }

  // Revisamos cache
  const cached = urlCache.get(streamName);
  const now = Date.now();
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    console.log(`   ♻️  Usando URL cacheada para ${streamName}`);
    return injectIP(cached.url, clientIP);
  }

  // Scrapeamos fresh
  console.log(`   🔄 Cache expirado o vacío, scrapeando ${streamName}...`);
  const rawUrl = await scrapeM3U8(streamName);

  urlCache.set(streamName, { url: rawUrl, fetchedAt: now });

  return injectIP(rawUrl, clientIP);
}

/**
 * Reemplaza (o agrega) el parámetro &ip= en la URL m3u8
 */
function injectIP(m3u8Url, ip) {
  try {
    const u = new URL(m3u8Url);
    u.searchParams.set('ip', ip);
    return u.toString();
  } catch {
    // Fallback con regex si URL() falla por algún motivo
    if (m3u8Url.includes('&ip=')) {
      return m3u8Url.replace(/(&ip=)[^&]+/, `$1${ip}`);
    }
    return `${m3u8Url}&ip=${ip}`;
  }
}

/**
 * Invalida el cache de un canal (útil si el stream falla)
 */
function invalidateCache(channelId) {
  const streamName = STREAM_MAP[channelId];
  if (streamName) urlCache.delete(streamName);
}

module.exports = { getM3U8WithClientIP, invalidateCache, STREAM_MAP };