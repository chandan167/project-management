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