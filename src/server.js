require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = require('./manifest');
const canalesFlow = require('./channels');
const { obtenerHeaders, log } = require('./utils');
const { createHandlers } = require('./handlers');

const builder = new addonBuilder(manifest);
const { streamHandler, catalogHandler } = createHandlers({ canalesFlow, obtenerHeaders, log });

builder.defineStreamHandler(streamHandler);
builder.defineCatalogHandler(catalogHandler);

// Servidor express para endpoints de health y debugging
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    log(`${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        canales_disponibles: canalesFlow.length,
        version: manifest.version
    });
});

app.get('/canales', (req, res) => {
    res.json({
        total: canalesFlow.length,
        canales: canalesFlow.map(c => ({ id: c.id, name: c.name, base_url: c.baseUrl }))
    });
});

const PORT = process.env.PORT || 7000;

// Usamos serveHTTP para exponer manifest.json y endpoints de Stremio
serveHTTP(builder.getInterface(), {
    port: PORT,
    endpoint: '/manifest.json'
});

app.listen(PORT + 1, () => {
    log(`Servidor express de apoyo iniciado en http://localhost:${PORT + 1}`);
    log(`Add-on expuesto en: http://localhost:${PORT}/manifest.json`);
});

// Manejo de errores global
process.on('uncaughtException', (error) => {
    log('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    log('Promesa rechazada no manejada:', promise, 'razón:', reason);
});
