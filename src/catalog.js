// En catalog.js, reemplazá la función getStreamUrl por esta:

const { getM3U8WithClientIP } = require('./scraper');

async function getStreamUrl(id, req) {
  const clientIP = await getClientIP(req);

  // Canales que usan scraping dinámico (tienen {IP} o querés token fresco)
  const SCRAPED_CHANNELS = new Set([
    'live',
    'live_canal1',
    'live_canal2',
    'live_canal3',
    'live_fox_sports_arg',
  ]);

  if (SCRAPED_CHANNELS.has(id)) {
    console.log(`   🤖 Obteniendo URL via scraping para: ${id}`);
    try {
      const url = await getM3U8WithClientIP(id, clientIP);
      if (url) return url;
    } catch (err) {
      console.error(`   ⚠️  Scraping falló para ${id}:`, err.message);
      // Cae al fallback con la template hardcodeada si falla
    }
  }

  // Fallback: template hardcodeada (canales sin scraping, ej: Canal 4 Esquel)
  const channels = generateChannelsForIP(clientIP);
  const channel = channels.find(c => c.id === id);
  return channel ? channel.streamUrl : null;
}