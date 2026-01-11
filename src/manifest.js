// Manifest del addon
module.exports = {
    id: 'flow-addon',
    version: '1.0.0',
    name: 'Cablevisión Flow TV',
    description: 'Canales de Cablevisión Flow mediante MPD',
    resources: ['stream', 'catalog'],
    types: ['tv'],
    idPrefixes: ['cvattv'],
    catalogs: [
        {
            type: 'tv',
            id: 'cvattv-channels',
            name: 'Cablevisión Flow - Canales',
            extra: [
                {
                    name: 'search',
                    isRequired: false,
                    options: []
                }
            ]
        }
    ]
};
