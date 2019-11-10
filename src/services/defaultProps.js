console.log('NODE_ENV', process.env.NODE_ENV)

export const API = process.env.NODE_ENV !== 'production' ? 
    'http://127.0.0.1:3333/': 
    'http://127.0.0.1:3333/'