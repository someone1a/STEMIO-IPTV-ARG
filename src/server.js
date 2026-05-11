#!/usr/bin/env node

const express = require('express');
const { addonBuilder, getRouter } = require('stremio-addon-sdk');
require('dotenv').config();

const manifest = require('./manifest');
const { getCatalog, getChannelById, getStreamUrl } = require('./catalog');

// Crea el builder del addon
const builder = new addonBuilder(manifest);

console.log('🔧 Configurando handlers del addon...');

// Handler del catálogo - lista de canales
builder.defineCatalogHandler(async (args) => {
  console.log('\n📺 CATÁLOGO SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);
  console.log(`   Extra:`, args.extra);

  try {
    // args.req es inyectado por el middleware de Express (ver abajo)
    const result = await getCatalog(args.type, args.id, args.extra, args.req);
    return result;
  } catch (error) {
    console.error('   ❌ Error en catalog handler:', error);
    return { metas: [] };
  }
});

// Handler de streams - URLs M3U8
builder.defineStreamHandler(async (args) => {
  console.log('\n▶️  STREAM SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);

  if (args.type !== 'tv') {
    console.log('   ❌ Tipo incorrecto');
    return { streams: [] };
  }

  try {
    const streamUrl = await getStreamUrl(args.id, args.req);

    if (!streamUrl) {
      console.log('   ❌ Canal no encontrado o scraping falló');
      return { streams: [] };
    }

    console.log(`   ✅ Stream URL lista`);
    console.log(`   🔗 ${streamUrl}`);

    return {
      streams: [
        {
          url: streamUrl,
          title: '🔴 En Vivo',
          name: 'Canal en vivo',
          behaviorHints: {
            notWebReady: false,
            countryWhitelist: [],
          },
        },
      ],
    };
  } catch (error) {
    console.error('   ❌ Error en stream handler:', error);
    return { streams: [] };
  }
});

// Handler de metadata - información del canal
builder.defineMetaHandler(async (args) => {
  console.log('\n📋 META SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);

  if (args.type !== 'tv') {
    console.log('   ❌ Tipo incorrecto');
    return { meta: null };
  }

  try {
    const channel = await getChannelById(args.id, args.req);

    if (!channel) {
      console.log('   ❌ Canal no encontrado');
      return { meta: null };
    }

    console.log(`   ✅ Retornando metadata de: ${channel.name}`);
    return { meta: channel };
  } catch (error) {
    console.error('   ❌ Error en meta handler:', error);
    return { meta: null };
  }
});

// ─── Servidor Express con middleware para inyectar req en args ───────────────

const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || '0.0.0.0';

const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);
const app = express();

// Middleware que inyecta el objeto req original en cada llamada al addon
// Esto permite que los handlers accedan a la IP del cliente via args.req
app.use((req, res, next) => {
  const originalHandle = router.handle.bind(router);
  router.handle = (request, response, callback) => {
    // Adjuntamos el req de Express al request del addon
    request.req = req;
    // Propagamos también a los args de cada handler via un parche en el router
    originalHandle(request, response, callback);
  };
  next();
});

// Montamos el router del addon en Express
app.use('/', router);

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Addon corriendo en http://${HOST}:${PORT}`);
  console.log(`📡 Manifest: http://${HOST}:${PORT}/manifest.json`);
  console.log(`🔗 Para instalar en Stremio:`);
  console.log(`   stremio://127.0.0.1:${PORT}/manifest.json\n`);
});