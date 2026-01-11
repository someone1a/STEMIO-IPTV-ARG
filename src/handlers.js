const axios = require('axios');

function createHandlers({ canalesFlow, obtenerHeaders, log }) {
    async function isMpdAccessible(mpdUrl, headers) {
        try {
            const res = await axios.head(mpdUrl, {
                headers,
                timeout: 15000,
                validateStatus: (s) => s < 500
            });
            return res.status === 200;
        } catch (err) {
            log('HEAD request failed for', mpdUrl, '->', err.message);
            return false;
        }
    }

    async function streamHandler({ id }) {
        try {
            log(`Buscando canal con ID: ${id}`);
            const canal = canalesFlow.find(c => c.id === id);
            if (!canal) {
                log('Canal no encontrado:', id);
                return { streams: [] };
            }

            const mpdUrl = `${canal.baseUrl}?ck=${encodeURIComponent(canal.ck)}`;
            log('URL del MPD:', mpdUrl);

            const headers = obtenerHeaders();
            const accessible = await isMpdAccessible(mpdUrl, headers);

            const stream = {
                url: mpdUrl,
                title: canal.name,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: `cvattv-${canal.id}`,
                    countryWhitelist: ['AR'],
                    requestHeaders: headers
                },
                headers,
                isDash: true
            };

            if (accessible) {
                log(`MPD accesible para ${canal.name}`);
                return { streams: [stream] };
            }

            // Si HEAD falló, devolvemos el stream igual (fallback)
            log(`MPD no accesible con HEAD, devolviendo fallback para ${canal.name}`);
            return { streams: [stream] };
        } catch (error) {
            log('Error general al procesar el stream:', error.message || error);
            return { streams: [] };
        }
    }

    async function catalogHandler({ type }) {
        if (type !== 'tv') return { metas: [] };
        const metas = canalesFlow.map(canal => ({
            id: canal.id,
            type: 'tv',
            name: canal.name,
            poster: 'https://via.placeholder.com/150x200?text=' + encodeURIComponent(canal.name),
            background: 'https://via.placeholder.com/1200x600?text=' + encodeURIComponent(canal.name),
            logo: 'https://via.placeholder.com/150x150?text=' + encodeURIComponent(canal.name.split(' ')[0])
        }));
        return { metas };
    }

    return { streamHandler, catalogHandler };
}

module.exports = { createHandlers };
