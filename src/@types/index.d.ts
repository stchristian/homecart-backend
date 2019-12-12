declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    SEED_ADMIN_EMAIL: string;
    SEED_ADMIN_PASSWORD: string;
    SEED_COURIER_EMAIL: string;
    SEED_COURIER_PASSWORD: string;
    SEED_NORMAL_EMAIL: string;
    SEED_NORMAL_PASSWORD: string;
  }
}