// Catálogo de canales disponibles con detección automática de IP

const https = require('https');

/**
 * Obtiene la IP pública del cliente desde el objeto request
 */
async function getClientIP(req) {
  if (!req) {
    console.log('   ⚠️  No hay request disponible, usando IP por defecto');
    return '190.182.188.246';
  }

  // Intenta obtener la IP de los headers del request
  const forwardedFor = req.headers?.['x-forwarded-for'];
  const realIP = req.headers?.['x-real-ip'];
  const remoteAddress = req.socket?.remoteAddress || req.connection?.remoteAddress;
  
  let clientIP = forwardedFor?.split(',')[0]?.trim() || realIP || remoteAddress;
  
  // Limpia IPv6 localhost
  if (clientIP === '::1' || clientIP === '::ffff:127.0.0.1') {
    clientIP = '127.0.0.1';
  }
  
  // Si la IP es local o privada, obtiene la IP pública
  if (!clientIP || 
      clientIP.startsWith('127.') || 
      clientIP.startsWith('192.168.') || 
      clientIP.startsWith('10.') || 
      clientIP.startsWith('172.16.') ||
      clientIP === '::1') {
    
    console.log('   🔍 IP local detectada, obteniendo IP pública...');
    
    try {
      clientIP = await fetchPublicIP();
      console.log(`   ✅ IP pública obtenida: ${clientIP}`);
    } catch (error) {
      console.log('   ⚠️  Error al obtener IP pública:', error.message);
      // Fallback a una IP por defecto
      clientIP = '190.182.188.246';
      console.log(`   ℹ️  Usando IP por defecto: ${clientIP}`);
    }
  } else {
    console.log(`   ✅ IP del cliente detectada: ${clientIP}`);
  }
  
  return clientIP;
}

/**
 * Obtiene la IP pública usando un servicio externo
 */
function fetchPublicIP() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.ipify.org',
      path: '/?format=json',
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'Stremio-Addon/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.ip);
        } catch (error) {
          reject(new Error('Error al parsear respuesta de IP'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout al obtener IP'));
    });

    req.end();
  });
}

/**
 * Plantillas de canales - URLs sin IP específica
 * La IP se reemplazará dinámicamente
 */
const channelTemplates = [
  
  {
    id: 'live_canal1',
    name: 'ESPN PREMIUM ARG',
    type: 'tv',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReVbLYLo_u8qBUFkkSihG7p4aklNqct3Gx4g&s',
    posterShape: 'landscape',
    description: 'Canal de televisión por suscripción premium argentino dedicado a la transmisión específicamente del fútbol de ese país',
    genres: ['Sports'],
    streamUrlTemplate: 'https://ssout.marsrivagg.click/espnpremium/index.m3u8?token=e855ab2445255b5a12ca732893fb7d708346f3bc-5a-1772544855-1772490855&ip=190.182.188.246'
  },
  {
    id: 'live_canal2',
    name: 'TNT SPORTS ARG',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/TNT_Sports_%282023%29.svg/960px-TNT_Sports_%282023%29.svg.png',
    posterShape: 'landscape',
    description: 'TNT Sports es un canal de televisión por suscripción argentino de deportes',
    genres: ['Deportes'],
    streamUrlTemplate: 'https://aw1wcm92zq.fubohd.com/tntsports/mono.m3u8?token=e5ba09507cb0187b66e9b2a2365914b33e916a9d-69-1773379226-1773361226'
  },
  {
    id: 'live_canal3',
    name: 'Tyc Sports',
    type: 'tv',
    poster: 'https://cdn.eldestapeweb.com/eldestape/102023/1697634872025/tyc-sports-papelon-en-vivo-tv-furia-hinchas-seleccion-argentina-jpg..webp?cw=720&ch=540&extw=jpg',
    posterShape: 'landscape',
    description: 'TyC Sports es un canal de televisión por suscripción argentino, el cual brinda la emisión de eventos deportivos destacados a nivel nacional e internacional.',
    genres: ['Deportes'],
    streamUrlTemplate: 'https://pecdl1.crackstreamslivehd.com/global/tycsports/index.m3u8?token=b4cdbb88d1c5ffc3a8472edf5c69adb03181bf6e-da-1770022203-1769968203&ip={IP}'
  },
  {
    id: 'live_canal4',
    name: 'Canal 4 Esquel',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Canal_4_Esquel_logo.png',
    posterShape: 'landscape',
    description: 'Canal 4 Esquel es un canal de televisión local de la ciudad de Esquel, en la provincia del Chubut, Argentina.',
    genres: ['Local', 'Variedades'],
    // Este canal no requiere IP, no tiene {IP} en la URL
    streamUrlTemplate: 'https://stream.arcast.com.ar/canal4esquel/canal4esquel/playlist.m3u8'
  },
  {
    id: 'live_fox_sports_arg',
    name: 'Fox Sports Argentina',
    type: 'tv',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Fox_Sports_Argentina_Logo.svg/1200px-Fox_Sports_Argentina_Logo.svg.png',
    posterShape: 'landscape',
    description: 'Fox Sports Argentina es un canal de televisión por suscripción argentino dedicado a la transmisión de eventos deportivos nacionales e internacionales.',
    genres: ['Sports'],
    streamUrlTemplate: 'https://doc1.crackstreamslivehd.com/global/fox1ar/index.m3u8?token=adb5e4c109e2c7b0a516cd3d69927ee945b0de8e-fc-1770022196-1769968196&ip={IP}'
  }
];

/**
 * Genera canales con la IP del usuario
 */
function generateChannelsForIP(ip) {
  return channelTemplates.map(template => ({
    id: template.id,
    name: template.name,
    type: template.type,
    poster: template.poster,
    posterShape: template.posterShape,
    description: template.description,
    genres: template.genres,
    streamUrl: template.streamUrlTemplate.replace(/{IP}/g, ip)
  }));
}

/**
 * Obtiene el catálogo con la IP del usuario
 */
async function getCatalog(type, id, extra, req) {
  console.log(`   ℹ️  getCatalog llamado con: type=${type}, id=${id}`);
  
  if (type !== 'tv') {
    console.log(`   ❌ Tipo incorrecto: esperado 'tv', recibido '${type}'`);
    return Promise.resolve({ metas: [] });
  }

  if (id !== 'live_channels') {
    console.log(`   ❌ ID de catálogo incorrecto: esperado 'live_channels', recibido '${id}'`);
    return Promise.resolve({ metas: [] });
  }

  // Obtiene la IP del cliente
  const clientIP = await getClientIP(req);
  
  // Genera canales con la IP del usuario
  const channels = generateChannelsForIP(clientIP);

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

  console.log(`   ✅ Retornando ${metas.length} canal(es) para IP: ${clientIP}`);
  metas.forEach(m => {
    console.log(`      - ${m.name} (${m.id})`);
  });

  return Promise.resolve({ metas });
}

/**
 * Obtiene un canal por ID con la IP del usuario
 */
async function getChannelById(id, req) {
  console.log(`   🔍 Buscando canal con id: ${id}`);
  
  // Obtiene la IP del cliente
  const clientIP = await getClientIP(req);
  
  // Genera canales con la IP del usuario
  const channels = generateChannelsForIP(clientIP);
  
  const ch = channels.find(c => c.id === id);
  
  if (!ch) {
    console.log(`   ❌ Canal no encontrado: ${id}`);
    console.log(`   📋 IDs disponibles:`, channels.map(c => c.id).join(', '));
    return null;
  }

  console.log(`   ✅ Canal encontrado: ${ch.name}`);
  console.log(`   📡 Stream URL: ${ch.streamUrl}`);

  return {
    id: ch.id,
    type: 'tv',
    name: ch.name,
    poster: ch.poster,
    posterShape: ch.posterShape,
    description: ch.description,
    genres: ch.genres || [],
    background: ch.poster,
    logo: ch.poster
  };
}

/**
 * Obtiene la URL del stream para un canal específico
 */
async function getStreamUrl(id, req) {
  const clientIP = await getClientIP(req);
  const channels = generateChannelsForIP(clientIP);
  const channel = channels.find(c => c.id === id);
  
  return channel ? channel.streamUrl : null;
}

module.exports = {
  getCatalog,
  getChannelById,
  getStreamUrl,
  channelTemplates
};