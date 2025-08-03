const ApiConfig = {
    ronditrackApiUrl: 'https://api.ronditrack.online/api/v1/',
    oauthUrl: 'https://api-sec-qa.ronditrack.online/oauth/token',
    USE_TOKEN: true,
}

if (window.location.hostname === 'localhost') {
    ApiConfig.ronditrackApiUrl = 'http://localhost:3342/api/v1/';
    ApiConfig.oauthUrl = 'http://localhost:3343/oauth/token';
}

if (window.location.hostname === 'qa.ronditrack.online') {
    ApiConfig.ronditrackApiUrl = 'https://qa.api.ronditrack.online/api/v1/';
    ApiConfig.oauthUrl = 'https://api-sec-qa.ronditrack.online/oauth/token';
}

if (window.location.hostname === 'ronditrack.online') {
    ApiConfig.ronditrackApiUrl = 'https://api.ronditrack.online/api/v1/';
    ApiConfig.oauthUrl = 'https://api-sec.ronditrack.online/oauth/token';
}

export const { ronditrackApiUrl, USE_TOKEN } = ApiConfig;