const ApiConfig = {
    ronditrackApiUrl: 'https://api.ronditrack.online/api/v1/',
    USE_TOKEN: false, // Temporalmente deshabilitado para debug
}

if (window.location.hostname === 'localhost') {
    ApiConfig.ronditrackApiUrl = 'http://localhost:3342/api/v1/';
}

export const { ronditrackApiUrl, USE_TOKEN } = ApiConfig;