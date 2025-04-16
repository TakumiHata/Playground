import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

// CSRFトークンの設定
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// CSRFトークンの検証ミドルウェア
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // GETリクエストはCSRFトークンの検証をスキップ
  if (req.method === 'GET') {
    return next();
  }

  // CSRFトークンの検証
  csrfProtection(req, res, next);
};

// CSRFトークンを取得するエンドポイント
export const getCsrfToken = (req: Request & { csrfToken: () => string }, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
}; 