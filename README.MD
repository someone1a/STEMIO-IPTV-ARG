# Stremio Addon - Cablevisión Flow TV

Proyecto refactorizado para mayor claridad y mantenibilidad.

Quick start

1. Copia `.env.example` a `.env` y ajusta variables (si es necesario).
2. Instala dependencias: `npm install`.
3. Inicia: `npm start` (o `npm run dev` con `nodemon`).

Endpoints

- Manifest: `http://localhost:7000/manifest.json`
- Health: `http://localhost:7000/health`
- Canales: `http://localhost:7000/canales`

Estructura

- `src/manifest.js` — manifest del addon
- `src/channels.js` — lista de canales
- `src/utils.js` — funciones auxiliares
- `src/handlers.js` — handlers (stream y catalog)
- `src/server.js` — arranque y endpoints express

Mejoras propuestas

- Añadir tests para endpoints y handlers
- Separar configuración por entornos
- Cargar canales desde JSON/DB
- Añadir CI para lint y tests
