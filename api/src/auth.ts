import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        roles: string[];
    };
}

interface TokenPayload {
    userId: number;
    email: string;
}

// Generate access token (short-lived)
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
};

// Authentication middleware
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header provided' });
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            roles: user.roles.map((ur: { role: { name: string } }) => ur.role.name)
        };

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};