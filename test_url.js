#!/usr/bin/env node

/**
 * Script para verificar que una URL M3U8 funciona correctamente
 * 
 * Uso:
 *   node test-url.js "https://tu-url-m3u8.m3u8"
 */

const https = require('https');
const http = require('http');
const url = require('url');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${colors.reset} ${message}`);
}

function testUrl(testUrl) {
  return new Promise((resolve, reject) => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          🧪 Verificación de URL M3U8                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    log(colors.cyan, '🔗', `URL a verificar:`);
    console.log(`   ${testUrl}\n`);

    const parsedUrl = url.parse(testUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*'
      }
    };

    log(colors.blue, '📡', 'Enviando petición HTTP...\n');

    const req = protocol.request(options, (res) => {
      log(colors.cyan, '📊', 'Respuesta recibida:\n');
      
      console.log(`   Status Code: ${res.statusCode}`);
      console.log(`   Status Message: ${res.statusMessage}\n`);

      log(colors.cyan, '📋', 'Headers de respuesta:\n');
      Object.keys(res.headers).forEach(key => {
        console.log(`   ${key}: ${res.headers[key]}`);
      });
      console.log('');

      // Analiza el status code
      if (res.statusCode === 200) {
        log(colors.green, '✅', 'Status Code 200 - La URL es accesible\n');
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        log(colors.yellow, '⚠️', `Redirección (${res.statusCode})`);
        log(colors.yellow, '→', `Nueva ubicación: ${res.headers.location}\n`);
      } else if (res.statusCode === 403) {
        log(colors.red, '❌', 'Error 403 - Acceso denegado');
        log(colors.yellow, '💡', 'El servidor está bloqueando la petición');
        log(colors.yellow, '   ', 'Posibles causas:');
        log(colors.yellow, '   ', '- Token expirado');
        log(colors.yellow, '   ', '- Restricciones de CORS');
        log(colors.yellow, '   ', '- Geobloqueo\n');
      } else if (res.statusCode === 404) {
        log(colors.red, '❌', 'Error 404 - URL no encontrada');
        log(colors.yellow, '💡', 'Verifica que la URL sea correcta\n');
      } else {
        log(colors.yellow, '⚠️', `Status Code inesperado: ${res.statusCode}\n`);
      }

      // Lee los primeros bytes del contenido
      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString();
        if (data.length > 500) {
          res.destroy(); // Detiene la descarga después de 500 bytes
        }
      });

      res.on('end', () => {
        if (data) {
          log(colors.cyan, '📄', 'Primeros bytes del contenido:\n');
          console.log('─────────────────────────────────────────────────────');
          console.log(data.substring(0, 500));
          console.log('─────────────────────────────────────────────────────\n');

          // Verifica si es un M3U8 válido
          if (data.includes('#EXTM3U') || data.includes('#EXT-X-')) {
            log(colors.green, '✅', 'El contenido parece ser un archivo M3U8 válido\n');
            
            if (data.includes('#EXT-X-STREAM-INF')) {
              log(colors.green, '📺', 'Playlist maestro detectado (múltiples calidades)\n');
            } else if (data.includes('#EXTINF')) {
              log(colors.green, '🎬', 'Playlist de medios detectado (segmentos de video)\n');
            }
          } else {
            log(colors.red, '❌', 'El contenido NO parece ser un archivo M3U8');
            log(colors.yellow, '💡', 'Verifica que la URL apunte a un archivo .m3u8\n');
          }
        }

        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    📊 RESUMEN                              ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        if (res.statusCode === 200 && data.includes('#EXTM3U')) {
          log(colors.green, '✅', 'RESULTADO: La URL es válida y funcional');
          log(colors.green, '✅', 'Puedes agregar esta URL a tu addon\n');
          resolve(true);
        } else {
          log(colors.red, '❌', 'RESULTADO: La URL tiene problemas');
          log(colors.yellow, '💡', 'Recomendaciones:');
          log(colors.yellow, '   ', '1. Verifica la URL en VLC: vlc "URL"');
          log(colors.yellow, '   ', '2. Comprueba si necesita un token válido');
          log(colors.yellow, '   ', '3. Prueba con headers personalizados\n');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(colors.red, '❌', 'Error al conectar con el servidor:\n');
      console.error(error);
      console.log('');
      log(colors.yellow, '💡', 'Posibles causas:');
      log(colors.yellow, '   ', '- URL incorrecta');
      log(colors.yellow, '   ', '- Servidor no disponible');
      log(colors.yellow, '   ', '- Problemas de red\n');
      reject(error);
    });

    req.end();
  });
}

// Obtiene la URL de los argumentos de línea de comandos
const testUrl = process.argv[2];

if (!testUrl) {
  console.log('\n❌ Error: Debes proporcionar una URL\n');
  console.log('Uso:');
  console.log('  node test-url.js "https://tu-url-m3u8.m3u8"\n');
  console.log('Ejemplo:');
  console.log('  node test-url.js "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"\n');
  process.exit(1);
}

// Ejecuta la verificación
testUrl(testUrl).catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});