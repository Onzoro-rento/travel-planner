# GitHub Copilot Instructions for travel-planner

ようこそ！このドキュメントは、AIコーディングアシスタントが `travel-planner` プロジェクトで効率的に開発を進めるためのガイドです。

## 🚀 プロジェクト概要

このプロジェクトは、Next.js (App Router) と Supabase を使用した旅行計画アプリケーションです。ユーザーは旅行プランを作成し、メンバーと共有、スケジュール管理、チャット、写真共有などを行えます。UIはモダンでレスポンシブな設計を目指しています。

**参照UI**: `travel-planner-app.tsx` にあるUIデザインを参考にしてください。

## 💻 主要技術スタック

* **フレームワーク**: Next.js (App Router)
* **UI**: React, Tailwind CSS
* **データベース**: Supabase (PostgreSQL)
* **ORM**: Prisma
* **認証**: NextAuth.js (Supabase Adapterを利用)
* **データフェッチ**:
    * 基本: Server Componentsでの直接フェッチ
    * クライアントサイドの動的データ: SWR
    * HTTPクライアント: Axios
* **地図**: Google Maps API

## 🏛️ アーキテクチャとディレクトリ構成

このプロジェクトは **Feature-Sliced Design** の考え方に強く影響を受けており、関心事の分離と機能ベースの分割を重視しています。ディレクトリ構成は以下の構造に従います。

```
root
├── public/
├── prisma/                  # DBスキーマ (Prismaの場合)
├── src/
│   ├── app/                 # [Routing Layer] ここにはロジックを書かない
│   │   ├── api/             # Backend API Endpoints
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts  # NextAuth Handler
│   │   ├── (auth)/          # Route Group (ログイン画面など)
│   │   │   └── login/
│   │   │       └── page.tsx # features/auth/routes/Login.tsx を呼ぶだけ
│   │   ├── dashboard/
│   │   │   └── page.tsx     # features/dashboard/routes/Dashboard.tsx を呼ぶだけ
│   │   ├── layout.tsx       # Root Layout
│   │   └── page.tsx         # Landing Page
│   │
│   ├── components/          # [Shared UI] 全体で使う汎用コンポーネント
│   │   ├── elements/        # Button, Input, Spinner (Atomicなもの)
│   │   ├── layouts/         # MainLayout, AuthLayout
│   │   └── ui/              # shadcn/ui などを使用する場合はここ
│   │
│   ├── features/            # [Feature Layer] アプリの主要機能ごとの分割
│   │   ├── auth/            # 認証機能
│   │   │   ├── components/  # LoginForm, RegisterForm (この機能専用のUI)
│   │   │   ├── api/         # Server Actions, API calls (login, logout)
│   │   │   ├── types/       # AuthUser, LoginCredentials
│   │   │   └── index.ts     # 公開API (外部からimportしてよいものを定義)
│   │   │
│   │   ├── todo/            # 例: Todo機能
│   │   │   ├── components/  # TodoList, TodoItem
│   │   │   ├── api/         # createTodo (Server Action), getTodos
│   │   │   └── types/       # TodoItemType
│   │   │
│   │   └── user/            # ユーザー管理機能
│   │
│   ├── hooks/               # [Global Hooks] 特定の機能に依存しないフック
│   │
│   ├── lib/                 # [Configuration] サードパーティライブラリの設定
│   │   ├── auth.ts          # NextAuth の設定 (authOptions)
│   │   ├── db.ts            # Prisma Client / DB接続インスタンス
│   │   ├── utils.ts         # cn() などの汎用ユーティリティ
│   │   └── axios.ts         # Axios インスタンス (必要な場合)
│   │
│   └── types/               # [Global Types] 全体で使う型定義 (envなど)
│
├── middleware.ts            # Next.js Middleware (認証ガードなど)
└── ...config files
```

### 各層の役割

* **app/**: [Routing Layer] ルーティング定義のみ。ロジックは書かない。`features/` のコンポーネントを呼び出すだけ。
* **components/**: [Shared UI] プロジェクト全体で再利用可能な汎用コンポーネント。Atomic Design の elements/layouts/ui に分ける。
* **features/**: [Feature Layer] 各機能（auth, todo, user など）を独立したモジュールとして分割。各機能は components/api/types/index.ts を含む。
* **hooks/**: [Global Hooks] 特定の機能に依存しない汎用フック。
* **lib/**: [Configuration] サードパーティライブラリの設定とインスタンス。
* **types/**: [Global Types] プロジェクト全体で使う型定義。

### コーディングのルールとパターン

1.  **データフロー**:
    * **サーバーが第一**: 可能な限りServer Componentsでデータをフェッチしてください。これにより、レンダリングパフォーマンスが向上します。
    * **クライアントでの動的取得**: ユーザー操作に応じたデータの再取得やキャッシュが必要な場合は、`SWR` を使用します。
    * **API通信**: データの更新（POST, PUT, DELETE）やクライアントからのデータ取得には、`axios` を使って `app/api/` のエンドポイントを呼び出してください。

    **例: 旅行データ取得フック (`hooks/useTrips.ts`)**
    ```typescript
    import useSWR from 'swr';
    import axios from 'axios';
    import { Trip } from '@/types/trip';

    const fetcher = (url: string) => axios.get(url).then(res => res.data);

    export function useTrips() {
      const { data, error, isLoading } = useSWR<Trip[]>('/api/trips', fetcher);

      return {
        trips: data,
        error,
        isLoading,
      };
    }
    ```

2.  **認証**:
    * 認証は `NextAuth.js` と `@auth/supabase-adapter` で管理します。
    * 認証が必要なAPIやページでは、必ずサーバーサイドでセッション情報を確認してください。 (`next-auth` の `getServerSession`)
    * **参照ファイル**: `lib/auth/auth.config.ts`, `app/api/trips/route.ts`

3.  **データベース (Supabase & Prisma)**:
    * データベーススキーマの定義とマイグレーションは `Prisma` で管理します。
    * テーブル定義は `nextjs-supabase-structure.md` の `Supabaseテーブル設計` セクションを参照してください。
    * **Row Level Security (RLS)** を有効活用し、データアクセス権限をDBレベルで制御します。APIを作成する際は、RLSポリシーを考慮した設計にしてください。

4.  **Google Maps連携**:
    * Google Mapsの表示は `@googlemaps/js-api-loader` を利用したクライアントコンポーネント (`'use client'`) で実装します。
    * APIキーは `.env.local` の `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を参照します。
    * **参照コンポーネント**: `components/maps/GoogleMap.tsx`

5.  **状態管理**:
    * サーバーから取得したデータは `SWR` で管理します。
    * フォームの状態管理には `React Hook Form` と `Zod` (バリデーション) の使用を推奨します。
    * UIの状態など、コンポーネントローカルな状態は `useState` や `useReducer` で管理してください。

## ✅ 開発フロー

1.  **環境変数の設定**: `.env.local` にSupabaseやGoogle、NextAuthのキーを設定します。
2.  **パッケージのインストール**: `npm install` または `yarn install`
3.  **開発サーバーの起動**: `npm run dev` または `yarn dev`
4.  **Prismaマイグレーション**: DBスキーマを変更した際は `npx prisma migrate dev` を実行します。

## 🔁 RESTful API 設計（プロジェクト向けルール）

このプロジェクトで API を実装・修正するときは、以下の RESTful 設計ルールを必ず守ってください。API は `app/api/*/route.ts` に実装します（App Router の server routes を使用）。

- エンドポイント命名
    - リソースは複数形で表記：`/api/trips`, `/api/trips/:id`, `/api/trips/:id/members`
    - ネストはドメイン関係に限定（例: スケジュールは旅行の子リソース `/api/trips/:tripId/schedules`）。

- HTTP メソッド
    - GET: 取得（一覧・単一）
    - POST: 作成（リソース作成）
    - PUT / PATCH: 更新（PUT は完全置換、PATCH は部分更新。基本は PATCH を推奨）
    - DELETE: 削除

- ステータスコードとレスポンスフォーマット
    - 成功: 200 / 201（作成）, ボディは JSON（データまたはメッセージ）
    - 認証エラー: 401
    - 権限エラー: 403
    - バリデーションエラー: 400（ボディに { error: string, details?: any }）
    - リソースなし: 404
    - サーバーエラー: 500
    - 一貫したフォーマットを維持（例: NextResponse.json({ data, meta }, { status: 200 }) または NextResponse.json({ error: message }, { status: 400 })）。

- 認証・認可
    - サーバー側で `getServerSession(authOptions)` を使ってセッションを必ず検査する（例: `const session = await getServerSession(authOptions)`）。
    - リクエスト元のユーザー ID は `session.user.id` に格納される想定。権限チェック（作成者か、メンバーか等）を API 側で行う。

- 入力バリデーション
    - API ルートで受け取る JSON は明確に検証する（Zod を使うか、簡易チェックを行う）。例：POST の必須フィールドが欠けていれば 400 を返す。

- エラーロギング
    - サーバー内の例外は console.error() で出力し、クライアントには汎用エラーメッセージを返す（内部スタックは返さない）。

- DB 操作
    - `prisma` は必ず `@/lib/prisma` からインポートして使う（shared instance）。
    - トランザクションが必要な変更は `prisma.$transaction([...])` を使う。

### 具体例（コピー可能）

サーバー側でセッションを検査して作成を行う（`app/api/trips/route.ts` の POST の想定例）:

```ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    // 簡易バリデーション
    if (!body.title || !body.startDate) return NextResponse.json({ error: 'Validation failed' }, { status: 400 })

    const trip = await prisma.trip.create({
        data: {
            title: body.title,
            description: body.description,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            createdBy: session.user.id,
        }
    })

    return NextResponse.json(trip, { status: 201 })
}
```

以上のルールは既存の `app/api/auth/register/route.ts` や `nextjs-api-structure.md` に準拠しています。実装変更がある場合は、該当 API と `prisma/schema.prisma`（DB スキーマ）との整合性を保ち、必要なら `npx prisma migrate dev` を実行してください。