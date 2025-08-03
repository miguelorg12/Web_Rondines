const ApiConfig = {
    ronditrackApiUrl: 'https://api.ronditrack.online/api/v1/',
    oauth
    USE_TOKEN: true,
}

if (window.location.hostname === 'localhost') {
    ApiConfig.ronditrackApiUrl = 'http://localhost:3342/api/v1/';
}

if (window.location.hostname === 'qa.ronditrack.online') {
    ApiConfig.ronditrackApiUrl = 'https://qa.api.ronditrack.online/api/v1/';
}

export const { ronditrackApiUrl, USE_TOKEN } = ApiConfig;