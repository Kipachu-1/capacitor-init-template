const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appSiteUrl: import.meta.env.VITE_APP_SITE_URL,
  isDev: import.meta.env.VITE_NODE_ENV === "development",
  revenueCatApiKey: import.meta.env.VITE_REVENUE_CAT_API_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  env: import.meta.env.VITE_NODE_ENV,
};

export default config;
