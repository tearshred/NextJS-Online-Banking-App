import crypto from 'crypto';

export function ensureJWTSecret() {
    if (!process.env.JWT_SECRET) {
        // Generate a new secret
        const newSecret = crypto.randomBytes(64).toString('hex');
        process.env.JWT_SECRET = newSecret;
        
        console.log('⚠️ No JWT_SECRET found in environment variables.');
        console.log('A temporary secret has been generated, but for production:');
        console.log('1. Add this to your .env file:');
        console.log(`JWT_SECRET=${newSecret}`);
        console.log('2. Add it to your deployment environment variables');
    }
    return process.env.JWT_SECRET;
} 