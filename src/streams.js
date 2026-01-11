const { channels } = require('./catalog');

// Handler de streams - retorna las URLs M3U8 para reproducir
function getStreams(type, id) {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📡 getStreams llamado`);
  console.log(`   Type: ${type}`);
  console.log(`   ID: ${id}`);
  console.log('═══════════════════════════════════════════════════════');
  
  // Verifica que el tipo sea 'tv'
  if (type !== 'tv') {
    console.log(`❌ Tipo incorrecto: ${type}`);
    return Promise.resolve({ streams: [] });
  }
  
  // Busca el canal por ID
  const channel = channels.find(ch => ch.id === id);
  
  if (!channel) {
    console.log(`❌ Canal no encontrado: ${id}`);
    console.log(`📋 Canales disponibles:`);
    channels.forEach(ch => {
      console.log(`   - ${ch.id} (${ch.name})`);
    });
    return Promise.resolve({ streams: [] });
  }
  
  console.log(`✅ Canal encontrado: ${channel.name}`);
  console.log(`📺 Nombre: ${channel.name}`);
  console.log(`🔗 URL del stream:`);
  console.log(`   ${channel.streamUrl}`);
  
  // Verifica si la URL parece válida
  if (!channel.streamUrl || !channel.streamUrl.startsWith('http')) {
    console.log(`⚠️  ADVERTENCIA: La URL del stream no parece válida`);
    console.log(`   Asegúrate de que la URL comience con http:// o https://`);
  }
  
  // Detecta si la URL tiene un token
  if (channel.streamUrl.includes('token=')) {
    console.log(`🔑 La URL contiene un token de autenticación`);
    console.log(`   ⚠️  Los tokens suelen expirar. Si el stream no funciona,`);
    console.log(`      verifica que el token siga siendo válido.`);
  }
  
  // Retorna el stream en formato Stremio
  const streams = [
    {
      // URL directa del M3U8
      url: channel.streamUrl,
      
      // Título que aparecerá en Stremio
      title: `🔴 ${channel.name} - En Vivo`,
      
      // Nombre corto
      name: `${channel.name}`,
      
      // Comportamiento del stream
      behaviorHints: {
        notWebReady: false,
        bingeGroup: `live-${channel.id}`,
        // Indica que es contenido en vivo
        countryWhitelist: []  // Sin restricciones geográficas
      }
    }
  ];
  
  console.log(`✅ Retornando ${streams.length} stream(s)`);
  console.log(`   Título: ${streams[0].title}`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return Promise.resolve({ streams });
}

// Versión CON headers HTTP personalizados
// USA ESTA VERSIÓN si tus streams requieren headers específicos
function getStreamsWithHeaders(type, id) {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📡 getStreamsWithHeaders llamado`);
  console.log(`   Type: ${type}`);
  console.log(`   ID: ${id}`);
  console.log('═══════════════════════════════════════════════════════');
  
  if (type !== 'tv') {
    console.log(`❌ Tipo incorrecto: ${type}`);
    return Promise.resolve({ streams: [] });
  }
  
  const channel = channels.find(ch => ch.id === id);
  
  if (!channel) {
    console.log(`❌ Canal no encontrado: ${id}`);
    return Promise.resolve({ streams: [] });
  }
  
  console.log(`✅ Canal encontrado: ${channel.name}`);
  console.log(`📺 Nombre: ${channel.name}`);
  console.log(`🔗 URL del stream: ${channel.streamUrl}`);
  console.log(`🔧 Agregando headers HTTP personalizados...`);
  
  const streams = [
    {
      url: channel.streamUrl,
      title: `🔴 ${channel.name} - En Vivo HD`,
      name: `${channel.name}`,
      
      // Headers HTTP personalizados
      // Estos headers ayudan a evitar bloqueos por CORS o User-Agent
      httpHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.stremio.com/',
        'Origin': 'https://www.stremio.com',
        'Accept': '*/*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        // Si tu stream requiere un header específico, agrégalo aquí:
        // 'Authorization': 'Bearer tu_token',
        // 'X-Custom-Header': 'valor',
      },
      
      behaviorHints: {
        notWebReady: false,
        bingeGroup: `live-${channel.id}`,
        countryWhitelist: []
      }
    }
  ];
  
  console.log(`✅ Retornando ${streams.length} stream(s) con headers personalizados`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  return Promise.resolve({ streams });
}

module.exports = {
  getStreams,
  getStreamsWithHeaders
};