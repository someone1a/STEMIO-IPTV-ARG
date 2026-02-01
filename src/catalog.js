// Catálogo de canales disponibles
// IMPORTANTE: Las URLs M3U8 deben ser accesibles y válidas

const { description } = require("./manifest");

const channels = [
  {
    id:'live_rosario_river',
    name: 'Rosario - River EN VIVO',
    type: 'tv',
    poster: 'https://cdn-img.zerozero.pt/img/noticias/020/imgS300I1041020T20260131003015.jpg',
    posterShape: 'landscape',
    description: 'Partido amistoso internacional de fútbol entre los equipos Peñarol de Uruguay y River Plate de Argentina.',
    genres: ['Sports'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl:'https://8c51.crackstreamslivehd.com/global/tntsports/index.m3u8?token=e95a4e33422d76a396778d78794699a874e8829e-cb-1770022133-1769968133&ip=190.182.188.246'
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
    streamUrl: 'https://14c51.crackstreamslivehd.com/global/espnpremium/index.m3u8?token=a6485e2dcfb29040c73be63d0e514a75f5e30f97-b9-1770022201-1769968201&ip=190.182.188.246'
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
    streamUrl: 'https://8c51.crackstreamslivehd.com/global/tntsports/index.m3u8?token=e95a4e33422d76a396778d78794699a874e8829e-cb-1770022133-1769968133&ip=190.182.188.246'
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
    streamUrl: 'https://pecdl1.crackstreamslivehd.com/global/tycsports/index.m3u8?token=b4cdbb88d1c5ffc3a8472edf5c69adb03181bf6e-da-1770022203-1769968203&ip=190.182.188.246'
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
  },
  {
    id: 'live_fox_sports_arg',
    name: 'Fox Sports Argentina',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Fox_Sports_Argentina_Logo.svg/1200px-Fox_Sports_Argentina_Logo.svg.png', 
    posterShape: 'landscape',
    description: 'Fox Sports Argentina es un canal de televisión por suscripción argentino dedicado a la transmisión de eventos deportivos nacionales e internacionales.',
    genres: ['Sports'],
    // URL M3U8 de prueba que FUNCIONA
    streamUrl: 'https://doc1.crackstreamslivehd.com/global/fox1ar/index.m3u8?token=adb5e4c109e2c7b0a516cd3d69927ee945b0de8e-fc-1770022196-1769968196&ip=190.182.188.246'
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