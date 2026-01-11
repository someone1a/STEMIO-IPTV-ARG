// Catálogo de canales disponibles
// IMPORTANTE: Las URLs M3U8 deben ser accesibles y válidas

const { description } = require("./manifest");

const channels = [
  {
    id: 'live_canal1',
    name: 'ESPN PREMIUM ARG',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/ESPN_Premium_logo.svg/250px-ESPN_Premium_logo.svg.png',
    posterShape: 'landscape',
    description: 'canal de televisión por suscripción premium argentino dedicado a la transmisión específicamente del fútbol de ese país',
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://anvtcax.fubohd.com/espnpremium/mono.m3u8?token=b18d1c3fd6fb1e7637090e0e1428500f626c11a8-d6-1768185307-1768167307'
  },
  {
    id: 'live_canal2',
    name: 'TNT SPORTS ARG',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/TNT_Sports_%282023%29.svg/960px-TNT_Sports_%282023%29.svg.png',
    posterShape: 'landscape',
    description: 'TNT Sports es un canal de televisión por suscripción Argentin de deportes',
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://anvtcax.fubohd.com/tntsports/mono.m3u8?token=9284802d1505ecf743d20e8df6999ea00dba9cee-86-1768186619-1768168619'
  },
  {
    id: 'live_canal3',
    name: 'Tyc Sports',
    type: 'tv',
    poster:'https://cdn.eldestapeweb.com/eldestape/102023/1697634872025/tyc-sports-papelon-en-vivo-tv-furia-hinchas-seleccion-argentina-jpg..webp?cw=720&ch=540&extw=jpg',
    posterShape:'landscape',
    description :'TyC Sports es un canal de televisión por suscripción argentino, el cual brinda la emisión de eventos deportivos destacados a nivel nacional e internacional.',
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://a2vlca.fubohd.com/tycsports/mono.m3u8?token=276d57d463590fc5fb1f82cdfbbf489dcbfc5c15-1e-1768190012-1768172012'
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 📌 CÓMO AGREGAR TUS PROPIAS URLs M3U8:
  // ═══════════════════════════════════════════════════════════════
  //
  // ANTES de agregar una URL, verifica que funciona:
  //
  // 1. Prueba la URL en VLC:
  //    vlc "https://tu-url-m3u8.m3u8"
  //
  // 2. O con curl para ver los headers:
  //    curl -I "https://tu-url-m3u8.m3u8"
  //
  // 3. Si la URL requiere token, asegúrate de que sea válido:
  //    curl "https://anvtcax.fubohd.com/canal/mono.m3u8?token=XXXXX"
  //
  // Si VLC puede reproducirlo, entonces Stremio también debería poder.
  //
  // EJEMPLO de cómo agregar tu canal:
  // {
  //   id: 'live_mi_canal',  // DEBE empezar con 'live_'
  //   name: 'Mi Canal',
  //   type: 'tv',
  //   poster: 'https://url-del-poster.jpg',
  //   posterShape: 'landscape',
  //   description: 'Descripción de mi canal',
  //   streamUrl: 'https://anvtcax.fubohd.com/canal-ejemplo/mono.m3u8?token=TOKEN_VALIDO'
  // }
  //
  // ⚠️ PROBLEMAS COMUNES:
  //
  // 1. TOKEN EXPIRADO:
  //    - Los tokens en las URLs M3U8 suelen expirar cada pocas horas
  //    - Solución: Actualiza el token regularmente
  //
  // 2. RESTRICCIONES CORS:
  //    - Algunos servidores bloquean peticiones desde Stremio
  //    - Solución: Usa headers personalizados (ver streams.js)
  //
  // 3. GEOBLOQUEO:
  //    - Algunos streams solo funcionan en ciertos países
  //    - Solución: Usa un VPN o busca streams sin geobloqueo
  //
  // 4. URL CON CARACTERES ESPECIALES:
  //    - Asegúrate de que la URL esté correctamente codificada
  //    - Ejemplo: espacios = %20
  //
  // ═══════════════════════════════════════════════════════════════
];

function getCatalog(type, id, extra) {
  console.log(`   ℹ️  getCatalog llamado con: type=${type}, id=${id}`);
  
  if (type !== 'tv') {
    console.log(`   ❌ Tipo incorrecto: esperado 'tv', recibido '${type}'`);
    return Promise.resolve({ metas: [] });
  }

  if (id !== 'live_channels') {
    console.log(`   ❌ ID de catálogo incorrecto: esperado 'live_channels', recibido '${id}'`);
    return Promise.resolve({ metas: [] });
  }

  // Convierte los canales en el formato que Stremio espera como metas
  const metas = channels.map(ch => ({
    id: ch.id,
    name: ch.name,
    type: 'tv',
    poster: ch.poster,
    posterShape: ch.posterShape || 'landscape',
    description: ch.description
  }));

  console.log(`   ✅ Retornando ${metas.length} canal(es)`);
  metas.forEach(m => {
    console.log(`      - ${m.name} (${m.id})`);
  });

  return Promise.resolve({ metas });
}

function getChannelById(id) {
  console.log(`   🔍 Buscando canal con id: ${id}`);
  
  const ch = channels.find(c => c.id === id);
  
  if (!ch) {
    console.log(`   ❌ Canal no encontrado: ${id}`);
    console.log(`   📋 IDs disponibles:`, channels.map(c => c.id).join(', '));
    return null;
  }

  console.log(`   ✅ Canal encontrado: ${ch.name}`);
  console.log(`   📡 Stream URL: ${ch.streamUrl}`);

  // Devuelve la metadata completa esperada por Stremio
  return {
    id: ch.id,
    type: 'tv',
    name: ch.name,
    poster: ch.poster,
    posterShape: ch.posterShape,
    description: ch.description,
    // Agregado para mejor compatibilidad
    background: ch.poster,
    logo: ch.poster
  };
}

module.exports = {
  channels,
  getCatalog,
  getChannelById
};