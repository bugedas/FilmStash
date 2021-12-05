// export const API_BASE_URL = 'https://localhost:8080';
export const API_BASE_URL = 'https://filmstash-backend.herokuapp.com';
export const ACCESS_TOKEN = 'accessToken';

// export const OAUTH2_REDIRECT_URI = 'https://localhost:8080/oauth2/redirect'
export const OAUTH2_REDIRECT_URI = 'https://filmstash.herokuapp.com/oauth2/redirect'

export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;