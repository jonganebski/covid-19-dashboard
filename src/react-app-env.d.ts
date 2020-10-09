/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PUBLIC_URL: string;
    REACT_APP_NAVER_CLIENT_ID: string;
    REACT_APP_NAVER_CLIENT_SECRET: string;
  }
}
interface Window {
  Stripe: any;
}
