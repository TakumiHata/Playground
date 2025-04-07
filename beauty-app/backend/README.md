# Beauty App Backend

美容サービス管理システムのバックエンドAPI

## アーキテクチャ

このプロジェクトはクリーンアーキテクチャの原則に基づいて構築されています。

```
src/core/
├── application/          # アプリケーション層
│   ├── controllers/     # コントローラー
│   └── use-cases/       # ユースケース
├── domain/              # ドメイン層
│   ├── entities/        # エンティティ
│   ├── repositories/    # リポジトリインターフェース
│   └── enums/          # 列挙型
├── infrastructure/      # インフラストラクチャ層
│   ├── persistence/     # データベース関連
│   ├── repositories/    # リポジトリ実装
│   ├── modules/         # モジュール設定
│   └── pipes/          # パイプ
└── shared/             # 共有レイヤー
    ├── auth/           # 認証関連
    ├── dto/            # DTO
    └── domain/         # 共有ドメイン
```

## 主な機能

- ユーザー管理（認証・認可）
- サービス管理（CRUD操作）
- ロールベースのアクセス制御

## 技術スタック

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT認証

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な設定を行う
```

3. データベースのセットアップ
```bash
npm run migration:run
```

4. アプリケーションの起動
```bash
npm run start:dev
```

## APIドキュメント

アプリケーション起動後、以下のURLでAPIドキュメントにアクセスできます：
- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json

## テスト

```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# テストカバレッジ
npm run test:cov
```

## 開発ガイドライン

- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)に従う
- プルリクエストは必ずテストを通過すること
- 新しい機能は必ずドキュメント化すること

## ライセンス

MIT 