import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Beauty App API')
  .setDescription(`
# 美容サービス管理システムのAPIドキュメント

## 概要
このAPIは美容サービス管理システムのバックエンドサービスを提供します。

## 認証
- Bearer Token認証を使用
- トークンはログインAPIから取得可能
- トークンはヘッダーに \`Authorization: Bearer <token>\` の形式で設定

## セキュリティ要件
- すべてのAPIはHTTPSでアクセスする必要があります
- レート制限: 1分間に100リクエストまで
- 管理者権限が必要なAPIは明示的に記載しています

## エラーレスポンス
すべてのエラーレスポンスは以下の形式で返されます：
\`\`\`json
{
  "code": "ERROR_CODE",
  "message": "エラーメッセージ",
  "details": "エラーの詳細（オプション）",
  "timestamp": "2024-04-07T12:00:00Z"
}
\`\`\`

## 共通エラーコード
- \`USER_NOT_FOUND\`: ユーザーが見つかりません
- \`UNAUTHORIZED\`: 認証に失敗しました
- \`FORBIDDEN\`: 権限が不足しています
- \`VALIDATION_ERROR\`: 入力値が不正です
- \`INTERNAL_SERVER_ERROR\`: サーバー内部エラー
`)
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('users', 'ユーザー管理関連のエンドポイント')
  .addTag('services', 'サービス管理関連のエンドポイント')
  .addTag('auth', '認証関連のエンドポイント')
  .build(); 