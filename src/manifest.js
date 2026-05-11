// Definición del manifest del addon según la especificación de Stremio
// https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md

const manifest = {
  // Identificador único del addon (IMPORTANTE: debe ser único)
  id: 'org.stremio.m3u8live',
  
  // Versión del addon
  version: '2.0.0',
   // Nombre del addon que aparecerá en Stremio
  name: 'M3U8 Live Channels',
  
  // Descripción del addon
  description: 'Addon para reproducir canales en vivo desde URLs M3U8',
  
  // Recursos que proporciona el addon
  resources: [
    'catalog',  // Catálogo de canales disponibles
    'stream',   // Streams para reproducir
    'meta'      // Metadata de los items (requerido por Stremio)
  ],
  
  // Tipos de contenido que maneja
  types: ['tv'],  // 'tv' para canales de televisión en vivo
  
  // Catálogos que expone el addon
  catalogs: [
    {
      type: 'tv',
      id: 'live_channels',
      name: 'Canales en Vivo',
      extra: []
    }
  ],
  
  // Configuración de tipos de contenido para streams
  idPrefixes: ['live_']
};

module.exports = manifest;