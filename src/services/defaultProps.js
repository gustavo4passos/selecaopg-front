console.log('NODE_ENV', process.env.NODE_ENV)

export const API = process.env.NODE_ENV !== 'production' ? 
    'http://localhost:3333/': 
    'http://localhost:3333/'