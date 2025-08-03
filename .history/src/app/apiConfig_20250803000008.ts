const ApiConfig = {
    ronditrackApiUrl: 'https://api.ronditrack.online/api/v1/',
    USE_TOKEN: true,
}

if (window.location.hostname === 'localhost') {
    ApiConfig.ronditrackApiUrl = 'http://localhost:3342/api/v1/';
}

if (window.location.hostname 
    
) 

export const { ronditrackApiUrl, USE_TOKEN } = ApiConfig;