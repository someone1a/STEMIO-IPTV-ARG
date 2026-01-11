#!/usr/bin/env node

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
require('dotenv').config();

const manifest = require('./manifest');
const { getCatalog, getChannelById } = require('./catalog');
const { getStreams } = require('./streams');

// Crea el builder del addon
const builder = new addonBuilder(manifest);

console.log('🔧 Configurando handlers del addon...');

// Handler del catálogo - lista de canales
builder.defineCatalogHandler((args) => {
  console.log('\n📺 CATÁLOGO SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);
  console.log(`   Extra:`, args.extra);
  
  return getCatalog(args.type, args.id, args.extra);
});

// Handler de streams - URLs M3U8
builder.defineStreamHandler((args) => {
  console.log('\n▶️  STREAM SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);
  
  return getStreams(args.type, args.id);
});

// Handler de metadata - información del canal
builder.defineMetaHandler((args) => {
  console.log('\n📋 META SOLICITADO:');
  console.log(`   Type: ${args.type}`);
  console.log(`   ID: ${args.id}`);
  
  if (args.type !== 'tv') {
    console.log('   ❌ Tipo incorrecto');
    return Promise.resolve({ meta: null });
  }
  
  const channel = getChannelById(args.id);
  
  if (!channel) {
    console.log('   ❌ Canal no encontrado');
    return Promise.resolve({ meta: null });
  }
  
  console.log(`   ✅ Retornando metadata de: ${channel.name}`);
  return Promise.resolve({ meta: channel });
});

// Configuración del servidor
const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || '0.0.0.0';

// Inicia el servidor
serveHTTP(builder.getInterface(), { 
  port: PORT,
  hostname: HOST 
});

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     🎬 Stremio M3U8 Live Addon - Servidor Iniciado       ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`🌐 Servidor escuchando en: http://${HOST}:${PORT}`);
console.log('');
console.log('📋 URLs importantes:');
console.log(`   Manifest:  http://localhost:${PORT}/manifest.json`);
console.log(`   Catálogo:  http://localhost:${PORT}/catalog/tv/live_channels.json`);
console.log(`   Stream:    http://localhost:${PORT}/stream/tv/live_canal1.json`);
console.log('');
console.log('💡 Para instalar en Stremio:');
console.log(`   http://localhost:${PORT}/manifest.json`);
console.log('');
console.log('🔍 Verificación rápida:');
console.log(`   curl http://localhost:${PORT}/manifest.json`);
console.log(`   curl http://localhost:${PORT}/catalog/tv/live_channels.json`);
console.log(`   curl http://localhost:${PORT}/stream/tv/live_canal1.json`);
console.log('');
console.log('✅ Handlers configurados:');
console.log('   - Catalog Handler');
console.log('   - Stream Handler');
console.log('   - Meta Handler');
console.log('');
console.log('⏹️  Presiona Ctrl+C para detener el servidor');
console.log('');

// Manejo de cierre
process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Cerrando servidor...');
  process.exit(0);
});