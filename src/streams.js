const { channels } = require('./catalog');

// Handler de streams - retorna las URLs M3U8 para reproducir
function getStreams(type, id) {
  // Verifica que el tipo sea 'tv' (canales en vivo)
  if (type !== 'tv') {
    return Promise.resolve({ streams: [] });
  }
  
  // Busca el canal por ID
  const channel = channels.find(ch => ch.id === id);
  
  // Si no encuentra el canal, retorna vacío
  if (!channel) {
    return Promise.resolve({ streams: [] });
  }
  
  // Retorna el stream en el formato que Stremio espera
  const streams = [
    {
      // URL directa del stream M3U8
      url: channel.streamUrl,
      
      // Título del stream que aparecerá en Stremio
      title: `${channel.name} - Live`,
      
      // Tipo de comportamiento del stream
      // 'live' indica que es un stream en vivo
      behaviorHints: {
        notWebReady: false,  // El stream es compatible con web
        bingeGroup: channel.id  // Agrupa streams relacionados
      }
    }
  ];
  
  return Promise.resolve({ streams });
}

// Función alternativa para streams con headers personalizados
// Útil si la URL M3U8 requiere autenticación o headers específicos
function getStreamsWithHeaders(type, id) {
  if (type !== 'tv') {
    return Promise.resolve({ streams: [] });
  }
  
  const channel = channels.find(ch => ch.id === id);
  
  if (!channel) {
    return Promise.resolve({ streams: [] });
  }
  
  // Si necesitas agregar headers HTTP personalizados:
  const streams = [
    {
      url: channel.streamUrl,
      title: `${channel.name} - Live HD`,
      
      // Headers HTTP personalizados (opcional)
      // Stremio pasará estos headers al hacer la petición
      httpHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://example.com/',
        // Agrega más headers si son necesarios
      },
      
      behaviorHints: {
        notWebReady: false,
        bingeGroup: channel.id
      }
    }
  ];
  
  return Promise.resolve({ streams });
}

module.exports = {
  getStreams,
  getStreamsWithHeaders
};