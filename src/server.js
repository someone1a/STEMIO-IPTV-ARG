#!/usr/bin/env node

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
require('dotenv').config();

const manifest = require('./manifest');
const { getCatalog, getChannelById, getStreamUrl } = require('./catalog');

// Crea el builder del addon
const builder = new addonBuilder(manifest);

console.log('🔧 Configurando handlers del addon...');

// Variable global para almacenar el request actual
let currentRequest = null;

// Handler del catálogo - lista de canales
builder.defineCatalogHandler(async (args) => {
  console.log('\n📺 CATÁLOGO SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);
  console.log(`   Extra:`, args.extra);
  
  try {
    const result = await getCatalog(args.type, args.id, args.extra, currentRequest);
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
    return Promise.resolve({ streams: [] });
  }
  
  try {
    const streamUrl = await getStreamUrl(args.id, currentRequest);
    
    if (!streamUrl) {
      console.log('   ❌ Canal no encontrado');
      return Promise.resolve({ streams: [] });
    }
    
    console.log(`   ✅ Stream URL generada con IP del usuario`);
    console.log(`   🔗 ${streamUrl}`);
    
    const streams = [
      {
        url: streamUrl,
        title: `🔴 En Vivo`,
        name: `Canal en vivo`,
        behaviorHints: {
          notWebReady: false,
          countryWhitelist: []
        }
      }
    ];
    
    return Promise.resolve({ streams });
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
    return Promise.resolve({ meta: null });
  }
  
  try {
    const channel = await getChannelById(args.id, currentRequest);
    
    if (!channel) {
      console.log('   ❌ Canal no encontrado');
      return Promise.resolve({ meta: null });
    }
    
    console.log(`   ✅ Retornando metadata de: ${channel.name}`);
    return Promise.resolve({ meta: channel });
  } catch (error) {
    console.error('   ❌ Error en meta handler:', error);
    return { meta: null };
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || 'localhost';

// Obtener la interfaz del addon
const addonInterface = builder.getInterface();

// Servir el addon con serveHTTP
serveHTTP(addonInterface, { port: PORT, host: HOST });