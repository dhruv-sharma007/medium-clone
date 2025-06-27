interface ICONFENV {
    IMAGE_KIT_PUBLIC_KEY: string,
    IMAGE_KIT_PRIVATE_KEY: string,
    URL_ENDPOINT: string,
    DATABASE_URL: string,
    JWT_SECRET: string,
}

export const confEnv: ICONFENV = {
    IMAGE_KIT_PUBLIC_KEY: String(process.env.IMAGE_KIT_PUBLIC_KEY),
    IMAGE_KIT_PRIVATE_KEY: String(process.env.IMAGE_KIT_PRIVATE_KEY),
    URL_ENDPOINT: String(process.env.URL_ENDPOINT),
    DATABASE_URL: String(process.env.DATABASE_URL),
    JWT_SECRET: String(process.env.JWT_SECRET),
}