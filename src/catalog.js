// Catálogo de canales disponibles
// IMPORTANTE: Las URLs M3U8 deben ser accesibles y válidas

const { description } = require("./manifest");

const channels = [
  {
    id:'live_phenarol_river',
    name: 'Peñarol River Plate',
    type: 'tv',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa-Phle5ACxwB6Wcf9LoJxHTys6Mdw_z62bg&s',
    posterShape: 'landscape',
    description: 'Partido amistoso internacional de fútbol entre los equipos Peñarol de Uruguay y River Plate de Argentina.',
    genres: ['Sports'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl:'https://99a1.crackstreamslivehd.com/tntsports/tracks-v1a1/mono.m3u8?ip=190.182.188.246&token=32028cd1603416d30c03a8e7fef1dff7510111d5-fd-1769659204-1769605204'
  },
  {
    id: 'live_canal1',
    name: 'ESPN PREMIUM ARG',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/ESPN_Premium_logo.svg/250px-ESPN_Premium_logo.svg.png',
    posterShape: 'landscape',
    description: 'canal de televisión por suscripción premium argentino dedicado a la transmisión específicamente del fútbol de ese país',
    genres: ['Sports'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://deportes.ksdjugfsddeports.com:9092/MTkwLjE4Mi4xODguMjQ2/5_.m3u8?token=fPl7f2clHWJl52y0BuDeww&expires=1768702228'
  },
  {
    id: 'live_canal2',
    name: 'TNT SPORTS ARG',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/TNT_Sports_%282023%29.svg/960px-TNT_Sports_%282023%29.svg.png',
    posterShape: 'landscape',
    description: 'TNT Sports es un canal de televisión por suscripción Argentin de deportes',
    genres: ['Deportes'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://deportes.ksdjugfsddeports.com:9092/MTkwLjE4Mi4xODguMjQ2/4_.m3u8?token=Wv3dpPQwszZVed0eAO2SsQ&expires=1768702159'
  },
  {
    id: 'live_canal3',
    name: 'Tyc Sports',
    type: 'tv',
    poster:'https://cdn.eldestapeweb.com/eldestape/102023/1697634872025/tyc-sports-papelon-en-vivo-tv-furia-hinchas-seleccion-argentina-jpg..webp?cw=720&ch=540&extw=jpg',
    posterShape:'landscape',
    description :'TyC Sports es un canal de televisión por suscripción argentino, el cual brinda la emisión de eventos deportivos destacados a nivel nacional e internacional.',
    genres: ['Deportes'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://dwqejs.6522236688.shop:8443/hls/neo2gy.m3u8?s=1MXzk_lH3Ssg73Urb3hEZg&e=1768270709'
  },
  {
    id:'live_canal4',
    name:'Canal 4 Esquel',
    type:'tv',
    poster:'https://upload.wikimedia.org/wikipedia/commons/3/3a/Canal_4_Esquel_logo.png',
    posterShape:'landscape',
    description:'Canal 4 Esquel es un canal de televisión local de la ciudad de Esquel, en la provincia del Chubut, Argentina. Ofrece programación variada que incluye noticias locales, programas culturales, entretenimiento y eventos comunitarios.',
    genres:['Local','Variedades'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl:'https://stream.arcast.com.ar/canal4esquel/canal4esquel/playlist.m3u8'
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
  //   genres: ['Sports'],
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
    description: ch.description,
    genres: ch.genres || []
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
    genres: ch.genres || [],
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