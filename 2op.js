const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// ===== MANIFEST =====
const manifest = {
    id: 'org.flowtv.channels',
    version: '1.0.2',
    name: 'Flow TV Argentina',
    description: 'Canales en vivo de Flow TV',
    resources: ['catalog', 'stream'],
    types: ['tv', 'channel'],
    catalogs: [
        {
            type: 'channel',
            id: 'flow_channels',
            name: 'Canales Flow TV'
        }
    ],
    idPrefixes: ['flowtv']
};

const builder = new addonBuilder(manifest);

// ===== CANALES =====
const canalesFlow = [
    {
        id: 'flowtv-fox-sports',
        name: 'Fox Sports Premium HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/Fox_Sports_Premiun_HD/SA_Live_dash_enc_C/Fox_Sports_Premiun_HD.mpd',
        ck: 'IjRjMjMwZGJjN2Y2YTRiZmE2YWQwYWE3M2ZmNzkyMzc0IjoiNDE4NmE3YzJhMTVmNTkwYTkzOTk4ODZmZWFlYzQyNTcn'
    },
    {
        id: 'flowtv-espn',
        name: 'ESPN HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/ESPN_HD/SA_Live_dash_enc_C/ESPN_HD.mpd',
        ck: null
    },
    {
        id: 'flowtv-espn2',
        name: 'ESPN 2 HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/ESPN2_HD/SA_Live_dash_enc_C/ESPN2_HD.mpd',
        ck: null
    },
    {
        id: 'flowtv-tyc',
        name: 'TyC Sports HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/TyC_Sports_HD/SA_Live_dash_enc_C/TyC_Sports_HD.mpd',
        ck: null
    },
    {
        id: 'flowtv-fox-sports-2',
        name: 'Fox Sports 2 HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/Fox_Sports_2_HD/SA_Live_dash_enc_C/Fox_Sports_2_HD.mpd',
        ck: null
    },
    {
        id: 'flowtv-fox-sports-3',
        name: 'Fox Sports 3 HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/Fox_Sports_3_HD/SA_Live_dash_enc_C/Fox_Sports_3_HD.mpd',
        ck: null
    },
    {
        id: 'flowtv-tntsports',
        name: 'TNT Sports HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/TNT_Sports_HD/SA_Live_dash_enc_C/TNT_Sports_HD.mpd',
        ck: null
    },
    {
        id: 'flowtv-tvn',
        name: 'TVN HD',
        type: 'channel',
        poster: 'https://i.imgur.com/placeholder.jpg',
        url: 'https://chromecast.cvattv.com.ar/live/c7eds/TVN_HD/SA_Live_dash_enc_C/TVN_HD.mpd',
        ck: null
    }
];

// ===== CATÁLOGO =====
builder.defineCatalogHandler(({ type, id }) => {
    console.log(`📋 Catalog request - type: ${type}, id: ${id}`);
    
    if (type === 'channel' && id === 'flow_channels') {
        const metas = canalesFlow.map(canal => ({
            id: canal.id,
            type: 'channel',
            name: canal.name,
            poster: canal.poster
        }));
        
        console.log(`✅ Devolviendo ${metas.length} canales`);
        return Promise.resolve({ metas });
    }
    
    return Promise.resolve({ metas: [] });
});

// ===== STREAMS - VERSIÓN MEJORADA =====
builder.defineStreamHandler(async ({ type, id }) => {
    console.log(`🔍 Stream request - type: ${type}, id: ${id}`);
    
    const canal = canalesFlow.find(c => c.id === id);
    
    if (!canal) {
        console.log(`❌ Canal no encontrado: ${id}`);
        return { streams: [] };
    }

    console.log(`✅ Preparando stream: ${canal.name}`);
    
    // Construir URL con token si existe
    let streamUrl = canal.url;
    if (canal.ck) {
        streamUrl += `?ck=${canal.ck}`;
    }

    // OPCIÓN 1: Stream directo con headers (para clientes que los soporten)
    const stream1 = {
        url: streamUrl,
        title: `🔴 ${canal.name} [Directo]`,
        behaviorHints: {
            notWebReady: true,
            bingeGroup: 'flowtv-live',
            proxyHeaders: {
                request: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://chromecast.cvattv.com.ar/',
                    'Origin': 'https://chromecast.cvattv.com.ar',
                    'Accept': '*/*'
                }
            }
        }
    };

    // OPCIÓN 2: Stream proxeado (más compatible)
    const PORT = process.env.PORT || 7000;
    const stream2 = {
        url: `http://localhost:${PORT}/proxy/${canal.id}`,
        title: `🌐 ${canal.name} [Proxy]`,
        behaviorHints: {
            notWebReady: true,
            bingeGroup: 'flowtv-proxy'
        }
    };

    console.log(`📺 Stream listo: ${canal.name}`);
    
    // Devolver ambas opciones para que el usuario pruebe
    return { streams: [stream1, stream2] };
});

// ===== SERVIDOR EXPRESS CON PROXY =====
const app = express();
app.use(cors());

// Proxy endpoint para streams
app.get('/proxy/:id', async (req, res) => {
    const canal = canalesFlow.find(c => c.id === req.params.id);
    
    if (!canal) {
        return res.status(404).send('Canal no encontrado');
    }

    try {
        console.log(`🔄 Proxy request para: ${canal.name}`);
        
        // Construir URL
        let url = canal.url;
        if (canal.ck) {
            url += `?ck=${canal.ck}`;
        }

        // Headers para el request
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://chromecast.cvattv.com.ar/',
            'Origin': 'https://chromecast.cvattv.com.ar',
            'Accept': '*/*',
            'Accept-Language': 'es-AR,es;q=0.9'
        };

        // Hacer request al stream
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: headers
        });

        // Copiar headers importantes
        res.set('Content-Type', response.headers['content-type']);
        if (response.headers['content-length']) {
            res.set('Content-Length', response.headers['content-length']);
        }

        // Pipe del stream
        response.data.pipe(res);

        response.data.on('error', (error) => {
            console.error(`❌ Error en stream ${canal.name}:`, error.message);
            res.end();
        });

    } catch (error) {
        console.error(`❌ Error en proxy para ${canal.name}:`, error.message);
        res.status(500).send('Error al obtener stream');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        addon: manifest.name,
        version: manifest.version,
        canales: canalesFlow.length,
        timestamp: new Date().toISOString()
    });
});

// Lista de canales
app.get('/canales', (req, res) => {
    res.json({
        total: canalesFlow.length,
        canales: canalesFlow.map(c => ({
            id: c.id,
            name: c.name,
            tiene_token: !!c.ck,
            url_base: c.url.split('?')[0]
        }))
    });
});

// Test individual con verificación
app.get('/test/:id', async (req, res) => {
    const canal = canalesFlow.find(c => c.id === req.params.id);
    
    if (!canal) {
        return res.status(404).json({ 
            encontrado: false,
            error: 'Canal no encontrado',
            canales_disponibles: canalesFlow.map(c => c.id)
        });
    }

    // Construir URL
    let url = canal.url;
    if (canal.ck) {
        url += `?ck=${canal.ck}`;
    }

    // Intentar hacer HEAD request
    try {
        const response = await axios.head(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://chromecast.cvattv.com.ar/',
                'Origin': 'https://chromecast.cvattv.com.ar'
            },
            timeout: 5000
        });

        res.json({
            encontrado: true,
            canal: {
                id: canal.id,
                name: canal.name,
                type: canal.type,
                url_completa: url
            },
            test_conexion: {
                accesible: true,
                status: response.status,
                content_type: response.headers['content-type']
            }
        });
    } catch (error) {
        res.json({
            encontrado: true,
            canal: {
                id: canal.id,
                name: canal.name,
                type: canal.type,
                url_completa: url
            },
            test_conexion: {
                accesible: false,
                error: error.message
            }
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`
╔═══════════════════════════════════════════════════════════╗
║         🚀 FLOW TV ADDON - SERVIDOR INICIADO               ║
╚═══════════════════════════════════════════════════════════╝

📡 Manifest URL:
   http://localhost:${PORT}/manifest.json

🔗 Endpoints:
   Health:   http://localhost:${PORT}/health
   Canales:  http://localhost:${PORT}/canales
   Test:     http://localhost:${PORT}/test/flowtv-fox-sports
   Proxy:    http://localhost:${PORT}/proxy/flowtv-fox-sports

╔═══════════════════════════════════════════════════════════╗
║                  📺 INSTALAR EN STREMIO                    ║
╚═══════════════════════════════════════════════════════════╝

1. Abre Stremio
2. Ve a "Addons" (ícono de puzzle)
3. "Community Addons" → campo URL arriba
4. Pega: http://localhost:${PORT}/manifest.json
5. Clic en "Install"

╔═══════════════════════════════════════════════════════════╗
║                   ▶️  VER LOS CANALES                      ║
╚═══════════════════════════════════════════════════════════╝

• En Stremio → "Board" → menú izquierdo → "Canales Flow TV"
• Cada canal tiene 2 opciones de stream:
  
  🔴 [Directo] - Stream directo (más rápido)
  🌐 [Proxy]   - Stream proxeado (más compatible)

💡 IMPORTANTE:
   - Si [Directo] no funciona, usa [Proxy]
   - Usa la app de escritorio de Stremio, no web
   - Los streams son DASH/MPD
   - Pueden tardar 5-10 segundos en iniciar

⚠️  TROUBLESHOOTING:
   1. Verifica que el addon esté instalado
   2. Prueba: http://localhost:${PORT}/test/flowtv-fox-sports
   3. Si no funciona, actualiza el token 'ck' en el código
   4. Revisa los logs en esta consola

📝 NOTA: El token 'ck' de Fox Sports Premium puede expirar.
   Si expira, necesitarás actualizarlo en el código.
`);