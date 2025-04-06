# Beauty App

美容院向けの予約管理システムのバックエンドAPI

## 機能要件

### 1. 認証・認可システム
- JWT認証によるユーザー認証
- ロールベースのアクセス制御（RBAC）
  - ユーザー（USER）
  - 管理者（ADMIN）
  - スタッフ（STAFF）

### 2. ユーザー管理
- ユーザーの登録・更新・削除
- ユーザー情報の管理
  - 基本情報（名前、メール、電話番号、住所）
  - ロール情報
  - パスワード管理

### 3. 予約管理
- 予約の作成・更新・削除
- 予約情報の管理
  - 日時
  - スタッフ
  - サービス
  - メモ
  - ステータス

### 4. スタッフ管理
- スタッフの登録・更新・削除
- スタッフ情報の管理
  - 基本情報
  - 役職
  - 専門分野
  - 担当サービス

### 5. サービス管理
- サービスの登録・更新・削除
- サービス情報の管理
  - サービス名
  - 説明
  - 料金
  - 所要時間
  - カテゴリー

## 技術スタック

### バックエンド
- NestJS
- Prisma
- PostgreSQL
- JWT認証
- class-validator
- class-transformer

### データベース
- Supabase（PostgreSQL）

## セキュリティ対策
- 環境変数による機密情報の管理
- パスワードのハッシュ化
- ロールベースのアクセス制御
- JWTトークンによる認証

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone <repository-url>
cd beauty-app
```

2. 依存関係のインストール
```bash
cd backend
npm install
```

3. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な情報を設定
```

4. データベースのマイグレーション
```bash
npx prisma migrate dev
```

5. アプリケーションの起動
```bash
npm run start:dev
```

## APIエンドポイント

### 認証
- `POST /auth/register` - ユーザー登録
- `POST /auth/login` - ログイン

### ユーザー管理
- `POST /users` - ユーザー作成（管理者のみ）
- `GET /users` - ユーザー一覧取得（管理者のみ）
- `GET /users/:id` - ユーザー詳細取得（管理者のみ）
- `PATCH /users/:id` - ユーザー情報更新（管理者のみ）
- `DELETE /users/:id` - ユーザー削除（管理者のみ）

### 予約管理
- `POST /reservations` - 予約作成（ユーザー・管理者）
- `GET /reservations` - 予約一覧取得（管理者・スタッフ）
- `GET /reservations/:id` - 予約詳細取得（ユーザー・管理者・スタッフ）
- `PATCH /reservations/:id` - 予約情報更新（管理者・スタッフ）
- `DELETE /reservations/:id` - 予約削除（管理者のみ）

### スタッフ管理
- `POST /staff` - スタッフ作成（管理者のみ）
- `GET /staff` - スタッフ一覧取得（管理者・スタッフ）
- `GET /staff/:id` - スタッフ詳細取得（管理者・スタッフ）
- `PATCH /staff/:id` - スタッフ情報更新（管理者のみ）
- `DELETE /staff/:id` - スタッフ削除（管理者のみ）

### サービス管理
- `POST /services` - サービス作成（管理者のみ）
- `GET /services` - サービス一覧取得（全ユーザー）
- `GET /services/:id` - サービス詳細取得（全ユーザー）
- `PATCH /services/:id` - サービス情報更新（管理者のみ）
- `DELETE /services/:id` - サービス削除（管理者のみ）

## 今後の拡張予定
- 予約の検索・フィルタリング機能
- スタッフのスケジュール管理
- サービスのカテゴリー管理
- 顧客のポイント管理
- オンラインカウンセリング機能 