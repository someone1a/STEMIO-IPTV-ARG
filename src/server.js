#!/usr/bin/env node

// Importa el SDK oficial de Stremio
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
require('dotenv').config();

// Importa los módulos del addon
const manifest = require('./manifest');
const { getCatalog, getChannelById } = require('./catalog');
const { getStreams } = require('./streams');

// Crea el builder del addon con el manifest
const builder = new addonBuilder(manifest);

// Define el handler para el catálogo
// Este endpoint se llama cuando Stremio solicita la lista de canales
builder.defineCatalogHandler((args) => {
  console.log(`📺 Catálogo solicitado: type=${args.type}, id=${args.id}`);
  return getCatalog(args.type, args.id, args.extra);
});

// Define el handler para los streams
// Este endpoint se llama cuando el usuario selecciona un canal para reproducir
builder.defineStreamHandler((args) => {
  console.log(`▶️  Stream solicitado: type=${args.type}, id=${args.id}`);
  return getStreams(args.type, args.id);
});

// Define el handler para metadata
builder.defineMetaHandler((args) => {
  console.log(`📋 Meta solicitado: type=${args.type}, id=${args.id}`);
  if (args.type !== 'tv') return Promise.resolve({ meta: null });

  const meta = getChannelById(args.id);
  if (!meta) return Promise.resolve({ meta: null });

  return Promise.resolve({ meta });
});

// Configuración del servidor
const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || '0.0.0.0';

// Inicia el servidor HTTP
serveHTTP(builder.getInterface(), { 
  port: PORT,
  hostname: HOST 
});

console.log('');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     🎬 Stremio M3U8 Live Addon - Servidor Iniciado       ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`🌐 Servidor escuchando en: http://${HOST}:${PORT}`);
console.log('');
console.log('📋 URLs importantes:');
console.log(`   Manifest: http://localhost:${PORT}/manifest.json`);
console.log(`   Instalar en Stremio: http://localhost:${PORT}/manifest.json`);
console.log('');
console.log('💡 Para instalar en Stremio:');
console.log('   1. Abre Stremio');
console.log('   2. Ve a Addons (icono de puzzle)');
console.log('   3. En la barra superior, pega la URL del manifest');
console.log('   4. Haz clic en "Install"');
console.log('');
console.log('⏹️  Presiona Ctrl+C para detener el servidor');
console.log('');

// Manejo graceful de cierre del servidor
process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Cerrando servidor...');
  process.exit(0);
});