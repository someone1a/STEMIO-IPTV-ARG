#!/usr/bin/env node

const express = require('express');
require('dotenv').config();

const manifest = require('./manifest');
const catalogModule = require('./catalog');

console.log('🔧 Configurando servidor del addon...');

const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Rutas del addon
app.get('/manifest.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(manifest);
});

app.get('/catalog/:type/:id.json', async (req, res) => {
  const { type, id } = req.params;
  const extra = req.query || {};
  const args = { type, id, extra, req };

  try {
    const result = await catalogModule.getCatalog(args.type, args.id, args.extra, args.req);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ metas: [] });
  }
});

app.get('/meta/:type/:id.json', async (req, res) => {
  const { type, id } = req.params;
  const args = { type, id, req };

  try {
    const result = await catalogModule.getChannelById(args.id, args.req);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(result ? { meta: result } : { meta: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ meta: null });
  }
});

app.get('/stream/:type/:id.json', async (req, res) => {
  const { type, id } = req.params;
  const args = { type, id, req };

  console.log(`Stream request from ${req.ip} for ${type}/${id}`);

  try {
    const streamData = await catalogModule.getStreamUrl(args.id, args.req);
    const normalized = typeof streamData === 'string'
      ? { url: streamData }
      : streamData || {};

    const result = normalized.url ? {
      streams: [{
        url: normalized.url,
        title: '🔴 En Vivo',
        name: 'Canal en vivo',
        ...(normalized.httpHeaders ? { httpHeaders: normalized.httpHeaders } : {}),
        behaviorHints: {
          notWebReady: false,
          countryWhitelist: [],
        },
      }],
    } : { streams: [] };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ streams: [] });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Addon corriendo en http://${HOST}:${PORT}`);
  console.log(`📡 Manifest: http://${HOST}:${PORT}/manifest.json`);
  console.log(`🔗 Para instalar en Stremio:`);
  console.log(`   stremio://127.0.0.1:${PORT}/manifest.json\n`);
});