export const Config = {
  API_URI: process.env.API_URI,
  API_WRITABLE: process.env.API_WRITABLE,
  API_SIGN_PETITION: process.env.API_SIGN_PETITION || '',
  BASE_APP_PATH: process.env.BASE_APP_PATH,
  BASE_URL: process.env.BASE_URL || '',
  GTAG_PETITION_CREATE: process.env.GTAG_PETITION_CREATE,
  ONLY_PROD_ROUTES: process.env.ONLY_PROD_ROUTES || '',
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || '',
  THEME: process.env.THEME || '',
  TRACK_SHARE_URL: process.env.TRACK_SHARE_URL || '',
  USE_HASH_BROWSING: process.env.USE_HASH_BROWSING || process.env.NODE_ENV === 'test',
  STATIC_ROOT: process.env.STATIC_ROOT,
  WORDPRESS_API_URI: process.env.WORDPRESS_API_URI,
  AB_TEST_ENABLED: process.env.AB_TEST_ENABLED,
  FAKE_ANALYTICS: process.env.FAKE_ANALYTICS,
  MESSENGER_APP_ID: process.env.MESSENGER_APP_ID
}
export default Config
