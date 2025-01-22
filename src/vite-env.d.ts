/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: number;
  readonly VITE_LOGIN_REDIRECT_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_NODE_ENV: 'development' | 'production';
  readonly VITE_API_ORIGIN: string;
  readonly VITE_UPLOADS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
