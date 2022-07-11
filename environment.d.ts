declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string
            MONGO_URI: string
            environment: 'dev' | 'prod' | 'debug'
        }
    }
}

export {}
