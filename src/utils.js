// Utilidades compartidas
function extraerMPDUrl(urlCompleta) {
    if (typeof urlCompleta !== 'string') return urlCompleta;
    if (urlCompleta.includes('chrome-extension://')) {
        const partes = urlCompleta.split('#');
        return partes[1] || urlCompleta;
    }
    return urlCompleta;
}

function obtenerHeaders() {
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://chromecast.cvattv.com.ar/',
        'Origin': 'https://chromecast.cvattv.com.ar',
        'Accept': '*/*',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };
}

function log(...args) {
    console.log(`[${new Date().toISOString()}]`, ...args);
}

module.exports = {
    extraerMPDUrl,
    obtenerHeaders,
    log
};
