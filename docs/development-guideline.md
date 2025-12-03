# 🧭 開発ガイドライン（コミットメッセージ・ブランチ命名・開発フロー）

---

# 📌 1. ブランチ命名規則

## 基本ルール（feature-based）

```
feat/xxxxxx     新機能
fix/xxxxxx      バグ修正
refactor/xxxxxx リファクタリング（仕様変更なし）
docs/xxxxxx     ドキュメント
chore/xxxxxx    依存関係/CI/設定変更
style/xxxxxx    コード整形
hotfix/xxxxxx   緊急修正
```

### 命名例

```
feat/login-page
feat/user-profile-edit
fix/firebase-auth-error
refactor/post-service
```

---

# 📌 2. コミットメッセージ規則（Conventional Commits）

## 基本構造

```
<type>: <簡潔な説明>

- 追加: 箇条書き
- 修正: 箇条書き
- 削除: 箇条書き（あれば）
```

### type 一覧

```
feat: 新機能
fix: バグ修正
refactor: リファクタ
docs: ドキュメント追加/修正
style: コード整形（動作に影響なし）
test: テスト関連の追加/修正
chore: ビルド・CI・依存関係
perf: パフォーマンス改善
```

### 良い例

```
feat: ルーム参加画面の追加

- RoomJoinPage の UI を作成
- パーティIDの入力バリデーションを追加
```

```
fix: Firestore のフィールド名ミスを修正

- players → members に変更
- FirestoreUserService も修正
```

---

# 📌 3. Git フロー（軽量版 GitHub Flow）

### 1. 新機能を始める

```
git checkout -b feat/xxx
```

### 2. コミットは小さく、意味ごとに

* 1コミット = 1変更内容
* 1つの Issue に対して複数コミットはOK

### 3. PR（Pull Request）の出し方

* タイトルは分かりやすく
* 概要、変更点、スクリーンショット（UIなら）を付ける
* コミットは squash しても良い

### 4. レビュー

* PRは **10〜15分以内で読める大きさ** が理想
* 修正は小さくまとめる

---
# 📌 4. Issue / PR の運用ルール

### Issue テンプレート（例）

```
## 📝 概要

## 🎯 目的

## ✔️ やること
- [ ]
- [ ]

## 📎 関連
- PR:
- その他:
```

### PR テンプレート（例）

```
## ✨ 変更内容

## 📚 背景・理由

## 🖼️ スクリーンショット（UI変更のみ）

## ✔️ 確認事項
- [ ] ビルドが通る
- [ ] ロジックに問題なし
- [ ] UI が正しく表示される
```

---

# 📌 5. Lint / Format / 自動チェックについて

* ESLint + Prettier（Next.js）
* Flutter: `flutter format` + `flutter analyze`
* GitHub Actions で PR 時に自動実行

例：PRチェック

```
- Build が通ること
- Lint が通ること
- タイプエラーが無いこと
```

---

# 📌 6. コードの書き方ガイド（FSD × Next.js）

### 🔹 原則：UI とロジックの分離

* `features/` にビジネスロジック
* `entities/` にモデル
* `shared/` に共通UI・utils

### 🔹 1画面にすべて書かない

* components, hooks, services, schemas に分離

### 🔹 API呼び出しは必ずサービス層で

* pages や components で直接 fetch しない

---

# 📌 7. 命名規則（変数・関数・ファイル）

### ファイル名

```
kebab-case
例）user-service.ts, room-join-form.tsx
```

### 変数・関数

```
camelCase
例）createUser(), fetchRoom(), userId
```

### コンポーネント

```
PascalCase
例）RoomJoinForm, UserAvatar
```

---



# 📌 10. 最後に（チーム文化）

* 迷ったら小さく作る
* 迷ったら共有する
* 迷ったら Issue を作る
* 迷ったらコメントを残す
* "レビューしやすいコード" が正義

---

常に改善していくため、必要に応じてこのガイドラインは更新してください！🚀
