import { Cookie } from '@builder.io/qwik-city';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { db } from './db';

type BaseUser = Pick<User, 'id' | 'email'>;

export const hashPassword = (password: string) => hash(password, 10);

export const comparePasswords = (plainTextPassword: string, hashedPassword: string) =>
    compare(plainTextPassword, hashedPassword);

export function createJWT(user: BaseUser): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7;

    return new SignJWT({ payload: { id: user.id, email: user.email } })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

async function validateJWT(jwt: string): Promise<unknown> {
    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload.payload;
}

export async function getUserFromCookie(cookies: Cookie): Promise<User | null> {
    try {
        if (!process.env.AUTH_COOKIE) {
            return null;
        }

        const jwt = cookies.get(process.env.AUTH_COOKIE);
        if (!jwt) {
            return null;
        }

        const resp = await validateJWT(jwt.value);

        if (resp && typeof resp === 'object' && 'id' in resp && typeof resp.id === 'string') {
            return db.user.findUnique({
                where: {
                    id: resp.id,
                },
            });
        }

        return null;
    } catch {
        return null;
    }
}
