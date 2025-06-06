# AI駆動開発100本ノック

## 概要
AIを活用して100日間で100個のアプリケーションを開発するチャレンジです。各アプリは1日で完成できる規模に設計されており、初級から上級まで段階的に難易度が上がっていきます。

## 現在の進捗

### Day 1: シンプルTODOリストアプリ ✅
- 実装済み機能
  - タスクの追加・編集・削除
  - タスクの完了/未完了の切り替え
  - ローカルストレージを使用したデータの永続化
  - レスポンシブデザイン
  - アクセシビリティ対応

### Day 2: デジタルタイマーアプリ 🔄
- 予定機能
  - カウントダウンタイマー
  - ストップウォッチ
  - アラート機能
  - ラップタイム記録

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks
- LocalStorage API

## プロジェクト構造
```
/
├── app/                    # Next.js App Router
│   ├── ai-challenge-100/   # 100本ノック用ディレクトリ
│   │   ├── day-1/         # Day 1: TODOリスト
│   │   └── day-2/         # Day 2: デジタルタイマー
├── docs/                   # ドキュメント
│   └── implementation_plan.md
├── lib/                    # ユーティリティ関数
├── public/                 # 静的ファイル
└── README.md
```

## 開発環境のセットアップ
1. リポジトリのクローン
```bash
git clone [repository-url]
cd [repository-name]
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

## 実装計画
詳細な実装計画は[こちら](docs/implementation_plan.md)をご覧ください。

## ライセンス
MIT
