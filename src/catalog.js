// Módulo de datos y helpers del catálogo
// Exporta un array `channels`, `getCatalog(type, id, extra)` y `getChannelById(id)`

const channels = [
  {
    id: 'live_canal1',
    name: 'Canal 1',
    type: 'tv',
    poster: 'https://via.placeholder.com/640x360.png?text=Canal+1',
    posterShape: 'landscape',
    description: 'Canal 1 en vivo - Noticias y entretenimiento',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id: 'live_canal2',
    name: 'Canal 2',
    type: 'tv',
    poster: 'https://via.placeholder.com/640x360.png?text=Canal+2',
    posterShape: 'landscape',
    description: 'Canal 2 en vivo - Deportes y acción',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
  }
];

function getCatalog(type, id, extra) {
  if (type !== 'tv') {
    return Promise.resolve({ metas: [] });
  }

  // Convierte los canales en el formato que Stremio espera como metas
  const metas = channels.map(ch => ({
    id: ch.id,
    name: ch.name,
    type: 'tv',
    poster: ch.poster,
    posterShape: ch.posterShape || 'landscape'
  }));

  return Promise.resolve({ metas });
}

function getChannelById(id) {
  const ch = channels.find(c => c.id === id);
  if (!ch) return null;

  // Devuelve la metadata completa esperada por Stremio
  return {
    id: ch.id,
    type: 'tv',
    name: ch.name,
    poster: ch.poster,
    posterShape: ch.posterShape,
    description: ch.description
  };
}

module.exports = {
  channels,
  getCatalog,
  getChannelById
};