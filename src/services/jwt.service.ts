import fs from 'fs';
import Jwt from 'jsonwebtoken';
import { environment } from '../config/environment';

const privateKey = fs.readFileSync('cert/private.pem');
const publicKey = fs.readFileSync('cert/public.pem');


export function generateAuthToken(payload: any) {
    return Jwt.sign({
        createdAt: Date.now(),
        payload: payload
    }, privateKey, { algorithm: 'RS256', expiresIn: environment.jwt.auth_token_expire_in, subject: 'jwt.auth.token' })
}

export function generateRefreshToken(payload: any) {
    return Jwt.sign({
        createdAt: Date.now(),
        payload: payload
    }, privateKey, { algorithm: 'RS256', expiresIn: environment.jwt.refresh_token_expire_in, subject: 'jwt.refresh.token' })
}

export function generateJwtToken(payload: any) {
    return {
        authToken: generateAuthToken(payload),
        refreshToken: generateRefreshToken(payload),
    }
}

export function verifyAuthToken(token: string) {
    try {
        return Jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            subject: 'jwt.auth.token'
        })
    } catch (error: Error | any) {
        if (error.name == 'JsonWebTokenError') {
            throw new Error('Auth token invalid')
        }
        if (error.name == 'TokenExpiredError') {
            throw new Error('Auth token expire')
        }
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return Jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            subject: 'jwt.refresh.token'
        })
    } catch (error: Error | any) {
        if (error.name == 'JsonWebTokenError') {
            throw new Error('Auth token invalid')
        }
        if (error.name == 'TokenExpiredError') {
            throw new Error('Auth token expire')
        }
    }
}