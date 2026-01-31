# 🗺️ 旅プランナー (Travel Planner)

友達と一緒に旅行を計画・共有できるWebアプリケーション


## 📝 概要

旅プランナーは、友達と一緒に旅行計画を立て、スケジュール管理、場所の共有、写真のアップロードなどができる旅行計画アプリケーションです。Google Maps APIとの連携により、訪問予定地を地図上で確認しながら計画を立てることができます。

### 主な機能

- 👥 **ユーザー認証**: メールアドレス/パスワードまたはGitHubアカウントでのログイン
- ✈️ **旅行計画作成**: 旅行のタイトル、日程、説明を設定して計画を作成
- 📍 **場所の登録**: Google Places APIを使用して訪問予定地を登録
- 🗺️ **地図表示**: Google Mapsで訪問地を視覚的に確認
- 👫 **メンバー招待**: 友達を旅行計画に招待して共同編集
- 📸 **写真共有**: 旅行の思い出を写真で共有
- ⭐ **レビュー**: 訪問した場所のレビューと評価
- 🔔 **通知機能**: フレンド申請、旅行招待などの通知

## 🚀 技術スタック

### フロントエンド
- **フレームワーク**: [Next.js 15](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Radix UI
- **状態管理**: SWR (データフェッチング)
- **地図**: Google Maps API

### バックエンド
- **データベース**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **認証**: NextAuth.js
- **認証プロバイダー**: 
  - Credentials (メール/パスワード)
  - GitHub OAuth

### 開発ツール
- **パッケージマネージャー**: npm
- **コード品質**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 🏗️ アーキテクチャ

このプロジェクトは **Feature-Sliced Design** の原則に基づいて構成されています。

```
src/
├── app/                    # Next.js App Router (ルーティング層)
│   ├── api/               # API Routes
│   ├── (auth)/            # 認証関連ページ
│   ├── trips/             # 旅行関連ページ
│   └── layout.tsx
├── components/            # 共有UIコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   └── ui/               # 汎用UIコンポーネント
├── features/             # 機能別モジュール (将来的に実装)
├── lib/                  # 設定とユーティリティ
│   ├── auth/            # NextAuth設定
│   ├── prisma.ts        # Prismaクライアント
│   └── utils.ts         # ユーティリティ関数
└── types/               # TypeScript型定義
```

詳細は [開発ガイドライン](docs/development-guideline.md) および [Copilot指示書](.github/copilot-instructions.md) を参照してください。

## 📋 前提条件

- Node.js 20.x 以上
- npm または yarn
- PostgreSQL データベース (または Supabase アカウント)
- Google Cloud Platform アカウント (Maps API用)
- GitHub OAuth App (GitHub認証を使用する場合)

## 🔧 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/travel-planner.git
cd travel-planner
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成し、以下の環境変数を設定します:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/travel_planner"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth (オプション)
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. データベースのセットアップ

```bash
# Prismaマイグレーションの実行
npx prisma migrate dev

# Prisma Clientの生成
npx prisma generate
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 📚 データベーススキーマ

データベーススキーマの詳細は [Prismaスキーマ設計書](docs/2025-12-03_旅行アプリのPrismaスキーマ設計書.md) を参照してください。

主要なモデル:
- `User` - ユーザー情報
- `Trip` - 旅行計画
- `Place` - 訪問予定地
- `TripMember` - 旅行メンバー
- `Photo` - 写真
- `Review` - レビュー
- `Notification` - 通知
- `Friendship` - フレンド関係

## 🧪 テストとビルド

```bash
# Lintチェック
npm run lint

# 型チェック
npm run type-check

# プロダクションビルド
npm run build

# ビルド後のアプリケーション起動
npm start
```

## 📝 開発ガイドライン

### ブランチ戦略

```
feat/xxxxx     - 新機能
fix/xxxxx      - バグ修正
refactor/xxxxx - リファクタリング
docs/xxxxx     - ドキュメント
chore/xxxxx    - 設定・依存関係の変更
```

### コミットメッセージ

Conventional Commits形式を使用:

```
feat: ログイン画面の追加

- LoginFormコンポーネントを作成
- メール/パスワード認証を実装
```

詳細は [開発ガイドライン](docs/development-guideline.md) を参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feat/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: 素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feat/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🔗 関連ドキュメント

- [GitHub Copilot 指示書](.github/copilot-instructions.md)
- [開発ガイドライン](docs/development-guideline.md)
- [Prismaスキーマ設計書](docs/2025-12-03_旅行アプリのPrismaスキーマ設計書.md)

## 💡 今後の予定

- [ ] チャット機能の実装
- [ ] リアルタイム通知
- [ ] モバイルアプリ対応
- [ ] オフラインサポート
- [ ] 多言語対応
- [ ] 旅行テンプレート機能

## 🐛 既知の問題

現在、既知の問題はありません。問題を発見した場合は [Issue](https://github.com/yourusername/travel-planner/issues) を作成してください。

## 📧 お問い合わせ

プロジェクトに関する質問や提案がある場合は、[Issue](https://github.com/yourusername/travel-planner/issues) を作成してください。

---

**Made with ❤️ by [Your Name]**
