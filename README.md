# AffiliateBusiness 運用マニュアル

AI を使ってアフィリエイト用の LP（ランディングページ）を自動生成し、クリック数を管理するシステムです。

---

## このシステムでできること

| やること | 使う画面 |
|---------|---------|
| LP（集客ページ）を AI で自動作成する | 管理画面 → LP生成 |
| LP にアクセスした人数・クリック数を確認する | 管理画面 → クリックログ |
| SNS（Twitter）に LP の宣伝を自動投稿する | LP生成時にまとめて実行 |
| SNS 投稿の結果を確認する | 管理画面 → SNS履歴 |

---

## 最初にやること（初回のみ）

### 手順1：アプリを起動する

ターミナルを開いて以下を実行します。

```bash
cd /Users/yanagiho-mba/iroiro/Affiliate/AffiliateBusiness
pnpm dev
```

「Local: http://localhost:3000」と表示されたら起動成功です。

### 手順2：管理画面にログインする

ブラウザで `http://localhost:3001` を開きます。

- ユーザー名：`admin`
- パスワード：`password`

> ⚠️ 本番運用時はパスワードを変更してください（後述）

### 手順3：APIキーを設定する（LP生成・SNS投稿を使う場合）

プロジェクトフォルダの `.env.local` ファイルを開き、以下の値を設定します。

```
# LP自動生成に使う（Anthropic Claude API）
ANTHROPIC_API_KEY=ここにキーを貼り付ける

# Twitter自動投稿に使う（Twitter API）
TWITTER_API_KEY=ここにキーを貼り付ける
TWITTER_API_SECRET=ここにキーを貼り付ける
TWITTER_ACCESS_TOKEN=ここにキーを貼り付ける
TWITTER_ACCESS_SECRET=ここにキーを貼り付ける
```

設定後、アプリを再起動してください（ターミナルで `Ctrl + C` → `pnpm dev`）。

#### Anthropic APIキーの取得方法
1. https://console.anthropic.com/ を開く
2. アカウント作成またはログイン
3. 「API Keys」→「Create Key」でキーを作成
4. 表示されたキー（`sk-ant-...`）を `.env.local` に貼り付ける

#### Twitter APIキーの取得方法
1. https://developer.twitter.com/ を開く
2. アカウント作成・プロジェクト申請
3. 「Keys and Tokens」から以下の4つを取得：
   - API Key → `TWITTER_API_KEY`
   - API Secret → `TWITTER_API_SECRET`
   - Access Token → `TWITTER_ACCESS_TOKEN`
   - Access Token Secret → `TWITTER_ACCESS_SECRET`

---

## 毎日の運用の流れ

```
① アプリ起動（pnpm dev）
        ↓
② 管理画面を開く（http://localhost:3001）
        ↓
③ LP生成 → 新しいLPを作る
        ↓
④ 生成されたLPのURLを確認・SNSに投稿
        ↓
⑤ クリックログを確認して成果を見る
```

---

## LP を作る手順

### 1. 管理画面上部の「LP生成」タブをクリック

### 2. 以下のフォームを入力する

| 入力項目 | 説明 | 例 |
|---------|------|----|
| LPタイトル | ページのタイトル | 「30代からの副業入門」 |
| 説明 | LPの内容の概要 | 「副業初心者が月5万円を稼ぐ方法を紹介」 |
| ターゲット | 誰向けのページか | 「30代会社員で副業に興味がある人」 |
| 関連オファー | 収益化するアフィリエイトリンク | リストから選択 |
| ジャンル | カテゴリ | ビジネス / 健康・美容 など |
| SNS投稿アカウント | 投稿するTwitterアカウント | 登録済みのものから選択 |
| キーワード | SNS投稿のハッシュタグになる語句 | 「副業」「在宅ワーク」など |

### 3. 「LPを生成」ボタンを押す

Claude AI が自動でLP文章を作成します（30秒〜1分ほどかかります）。

### 4. 生成結果を確認する

成功すると以下が表示されます：

- **LP URL**：`http://localhost:3000/lp/〇〇〇〇` → これが公開ページです
- **SNS投稿結果**：Twitter への投稿が成功/失敗したか

---

## クリックログを確認する手順

管理画面トップ（`http://localhost:3001`）で確認できます。

| 表示項目 | 意味 |
|---------|-----|
| 総クリック数 | LP経由でアフィリエイトリンクを踏んだ合計回数 |
| オファー別クリック数 | どのリンクが何回クリックされたか |
| クリックログ一覧 | いつ・どこから・どのリンクがクリックされたか |

---

## SNS 投稿履歴を確認する

管理画面上部の「SNS履歴」タブをクリックします。

- 投稿日時・対象LP・成功/失敗が一覧で確認できます
- 失敗している場合は APIキーの設定を確認してください

---

## 現在できないこと（開発者対応が必要）

以下の操作は現在 UI が未完成のため、管理画面からは操作できません。
必要な場合は開発者に依頼してください。

| やりたいこと | 状況 |
|------------|------|
| SNSアカウントの追加・削除 | UI未実装（DB直接操作が必要） |
| オファー（アフィリエイトリンク）の追加・編集 | UI未実装（DB直接操作が必要） |
| 診断LP（質問ツリー型ページ）の追加 | UI未実装（コード編集が必要） |

---

## 画面一覧（URL早見表）

| URL | 画面 |
|-----|------|
| `http://localhost:3000` | LPサイト（トップ） |
| `http://localhost:3000/lp/〇〇` | 生成されたLP |
| `http://localhost:3001` | 管理画面（クリックログ） |
| `http://localhost:3001/generate-lp` | LP生成 |
| `http://localhost:3001/sns-history` | SNS投稿履歴 |
| `http://localhost:3001/sns-accounts` | SNSアカウント一覧 |

---

## トラブルシューティング

### アプリが起動しない

```bash
# ポートが使用中の場合
pkill -f "next dev"
pnpm dev
```

### LP生成でエラーが出る

- `ANTHROPIC_API_KEY` が `.env.local` に正しく設定されているか確認
- キーの先頭が `sk-ant-` で始まっていることを確認

### SNS投稿が失敗する

- Twitter API キーが4つすべて設定されているか確認
- Twitter Developer Portal でアプリの「読み書き権限」が有効か確認

### ログを確認する

ターミナルでアプリ起動中にエラーメッセージが表示されます。
エラー文をそのままコピーして開発者に共有してください。

---

## セキュリティ（本番運用前に必ず対応）

```bash
# AUTH_SECRET を生成する（ターミナルで実行）
openssl rand -base64 32
```

生成された文字列を `.env.local` の `AUTH_SECRET` に設定し、
`ADMIN_PASSWORD` もデフォルトの `password` から変更してください。

---

## バックアップ

データベース（クリックログ等）は `data/clicks.db` に保存されています。

```bash
# バックアップ（日付付きでコピー）
cp data/clicks.db data/clicks.db.backup.$(date +%Y%m%d)
```

---

## 技術スタック（参考）

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript 5 |
| DB（ローカル） | SQLite |
| DB（本番） | PostgreSQL |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| SNS | Twitter API v2 |
| 認証 | NextAuth.js v5 |
| パッケージ管理 | pnpm + Turborepo |
