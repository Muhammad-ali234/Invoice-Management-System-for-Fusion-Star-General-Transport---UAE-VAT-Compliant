/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REALM_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
