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

このプロジェクトは **bulletproof-react** の考え方に強く影響を受けており、関心事の分離と機能ベースの分割を重視しています。ディレクトリ構成は `nextjs-supabase-structure.md` に従います。

### 主要ディレクトリの役割

* `app/`: App Routerのルーティング定義。
    * `(auth)`: 認証関連ページ（ログイン、新規登録）のグループ。
    * `(protected)`: 認証が必須なページのグループ。`layout.tsx`で認証チェックを行います。
    * `api/`: RESTfulなAPIエンドポイント。Server Actionsではなく、こちらでロジックを管理します。
* `components/`: UIコンポーネント。
    * `ui/`: ボタンやカードなど、プロジェクト全体で再利用可能な汎用コンポーネント。
    * `trips/`, `maps/`, `schedule/`: 特定の機能（ドメイン）に関連するコンポーネント。
* `lib/`: 再利用可能な関数やクライアントの設定。
    * `supabase/`: Supabaseクライアントの初期化や型定義。
    * `auth/`: NextAuth.jsの設定。
* `services/`: ビジネスロジック層。APIルートから呼び出され、DB操作や外部APIとの連携など、複雑な処理を担当します。
* `hooks/`: `useTrips`など、複数のコンポーネントで利用されるカスタムフック。
* `types/`: プロジェクト全体で使われるTypeScriptの型定義。

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