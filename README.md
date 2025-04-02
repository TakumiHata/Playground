# Playground

このリポジトリには、様々なプロジェクトが含まれています。

## プロジェクト一覧

### Beauty App
美容系アプリケーション（開発中）

#### 技術スタック
- フロントエンド: React + TypeScript + Material-UI
- バックエンド: NestJS + TypeScript
- データベース: MySQL (Supabase)
- 認証: JWT

#### 開発環境のセットアップ
1. リポジトリのクローン
```bash
git clone [repository-url]
cd Playground/beauty-app
```

2. バックエンドのセットアップ
```bash
cd backend
npm install
cp .env.example .env  # 環境変数の設定
npx prisma generate   # Prismaクライアントの生成
```

3. フロントエンドのセットアップ
```bash
cd ../frontend
npm install
```

4. 開発サーバーの起動
```bash
# バックエンド
cd backend
npm run start:dev

# フロントエンド（別ターミナルで）
cd frontend
npm start
```

#### Docker環境での実行
```bash
cd beauty-app
docker-compose up -d
```

## ライセンス
MIT
