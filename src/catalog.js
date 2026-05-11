// En catalog.js, reemplazá la función getStreamUrl por esta:

const { getM3U8WithClientIP, STREAM_MAP } = require('./scraper');

// Función auxiliar para obtener la IP del cliente
async function getClientIP(req) {
  const headers = req?.headers || {};
  const ip = headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             headers['x-real-ip'] ||
             req?.connection?.remoteAddress ||
             req?.socket?.remoteAddress ||
             req?.ip ||
             '127.0.0.1';

  return ip.replace(/^::ffff:/, '');
}

const CHANNEL_METADATA = {
  live: {
    name: 'Global Stream',
    description: 'Stream global principal',
    genres: ['General'],
    poster: 'https://streamtp-abc.net/global1.php?stream=live',
    background: 'https://streamtp-abc.net/global1.php?stream=live',
    logo: 'https://streamtp-abc.net/global1.php?stream=live',
  },
  live_canal1: {
    name: 'ESPN Premium',
    description: 'Canal de deportes premium',
    genres: ['Deportes'],
  },
  live_canal2: {
    name: 'TNT Sports',
    description: 'Canal de deportes en vivo',
    genres: ['Deportes'],
  },
  live_canal3: {
    name: 'TyC Sports',
    description: 'Canal de deportes argentinos',
    genres: ['Deportes'],
  },
  live_fox_sports_arg: {
    name: 'Fox Sports Argentina',
    description: 'Canal Fox Sports en versión Argentina',
    genres: ['Deportes'],
  },
};

const BASE_CHANNELS = Object.keys(STREAM_MAP).map((id) => {
  const meta = CHANNEL_METADATA[id] || {};
  return {
    id,
    type: 'tv',
    name: meta.name || id,
    poster: meta.poster || `https://streamtp-abc.net/global1.php?stream=${STREAM_MAP[id]}`,
    background: meta.background || `https://streamtp-abc.net/global1.php?stream=${STREAM_MAP[id]}`,
    logo: meta.logo || `https://streamtp-abc.net/global1.php?stream=${STREAM_MAP[id]}`,
    description: meta.description || `Stream ${STREAM_MAP[id]}`,
    genres: meta.genres || ['TV'],
    streamUrl: `https://streamtp-abc.net/global1.php?stream=${STREAM_MAP[id]}`,
  };
});

function generateChannelsForIP(clientIP) {
  return BASE_CHANNELS.map(channel => ({
    ...channel,
    streamUrl: `https://streamtp-abc.net/global1.php?stream=${STREAM_MAP[channel.id]}`,
  }));
}

// Función para obtener el catálogo de canales
async function getCatalog(type, id, extra, req) {
  if (type !== 'tv' || id !== 'live_channels') {
    return { metas: [] };
  }

  const clientIP = await getClientIP(req);
  const channels = generateChannelsForIP(clientIP);

  const metas = channels.map(channel => ({
    id: channel.id,
    type: channel.type,
    name: channel.name,
    poster: channel.poster,
    background: channel.background,
    logo: channel.logo,
    description: channel.description,
    genres: channel.genres,
  }));

  return { metas };
}

// Función para obtener un canal por ID
async function getChannelById(id, req) {
  const clientIP = await getClientIP(req);
  const channels = generateChannelsForIP(clientIP);
  const channel = channels.find(c => c.id === id);

  if (!channel) return null;

  return {
    id: channel.id,
    type: channel.type,
    name: channel.name,
    poster: channel.poster,
    background: channel.background,
    logo: channel.logo,
    description: channel.description,
    genres: channel.genres,
  };
}

async function getStreamUrl(id, req) {
  const clientIP = await getClientIP(req);
  const streamName = STREAM_MAP[id];
  if (!streamName) {
    console.log(`   ❌ Canal sin mapeo de scraping: ${id}`);
    return null;
  }

  console.log(`   🤖 Obteniendo URL via scraping para: ${id}`);
  try {
    const url = await getM3U8WithClientIP(id, clientIP);
    return url;
  } catch (err) {
    console.error(`   ⚠️  Scraping falló para ${id}:`, err.message);
    return null;
  }
}

module.exports = {
  getCatalog,
  getChannelById,
  getStreamUrl,
  channels: BASE_CHANNELS,
};