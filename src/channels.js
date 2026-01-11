// Lista de canales (puedes cargar dinámicamente desde un JSON o DB)
const canalesFlow = [
    {
        id: 'cvattv_fox_sports_premium',
        name: 'Fox Sports Premium HD',
        baseUrl: 'https://chromecast.cvattv.com.ar/live/c7eds/Fox_Sports_Premiun_HD/SA_Live_dash_enc_C/Fox_Sports_Premiun_HD.mpd',
        ck: 'IjRjMjMwZGJjN2Y2YTRiZmE2YWQwYWE3M2ZmNzkyMzc0IjoiNDE4NmE3YzJhMTVmNTkwYTkzOTk4ODZmZWFlYzQyNTcn'
    },
    {
        id: 'cvattv_tvn',
        name: 'TVN HD',
        baseUrl: 'https://chromecast.cvattv.com.ar/live/c7eds/TVN_HD/SA_Live_dash_enc_C/TVN_HD.mpd',
        ck: 'tu-ck-aqui-si-necesitas-uno-especifico'
    },
    {
        id: 'cvattv_espn',
        name: 'ESPN HD',
        baseUrl: 'https://chromecast.cvattv.com.ar/live/c7eds/ESPN_HD/SA_Live_dash_enc_C/ESPN_HD.mpd',
        ck: 'tu-ck-aqui-si-necesitas-uno-especifico'
    },
    {
        id: 'cvattv_tyc_sports',
        name: 'TyC Sports HD',
        baseUrl: 'https://chromecast.cvattv.com.ar/live/c7eds/TyC_Sports_HD/SA_Live_dash_enc_C/TyC_Sports_HD.mpd',
        ck: 'tu-ck-aqui-si-necesitas-uno-especifico'
    }
];

module.exports = canalesFlow;
