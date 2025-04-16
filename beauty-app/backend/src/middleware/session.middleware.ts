import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const prisma = new PrismaClient();

// セッション設定
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    prisma as any,
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  ),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  },
});

// セッションの検証ミドルウェア
export const validateSession = (req: Request & { session: session.Session & Partial<session.SessionData> }, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: '認証が必要です',
      message: 'セッションが無効か、期限切れです',
    });
  }
  next();
};

// セッションの更新ミドルウェア
export const refreshSession = (req: Request & { session: session.Session & Partial<session.SessionData> }, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    req.session.touch();
  }
  next();
}; 