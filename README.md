# AffiliateBusiness - 運用マニュアル

AI運用型アフィリエイト事業基盤。LP・診断導線・クリック計測を一元管理するモノレポ。

## 📋 目次

- [システム概要](#システム概要)
- [クイックスタート](#クイックスタート)
- [ディレクトリ構成](#ディレクトリ構成)
- [技術スタック](#技術スタック)
- [インストール・セットアップ](#インストールセットアップ)
- [環境設定](#環境設定)
- [使用方法](#使用方法)
- [管理機能](#管理機能)
- [API仕様](#api仕様)
- [デプロイ](#デプロイ)
- [トラブルシューティング](#トラブルシューティング)
- [メンテナンス](#メンテナンス)

## 🎯 システム概要

AffiliateBusinessは、AIを活用したアフィリエイト事業プラットフォームです。

### 主な機能

- **🤖 AI自動LP生成**: Claude APIで魅力的なLPを自動生成
- **📊 クリックログ管理**: 全クリックを追跡・分析
- **🔄 SNS自動投稿**: LP生成時に自動でSNS投稿
- **📱 レスポンシブLP**: モバイル最適化されたLPテンプレート
- **🎯 診断LPエンジン**: ツリー型診断でコンバージョン向上
- **👥 複数アカウント管理**: 複数SNSアカウント・ジャンル対応

### アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   Admin Panel   │    │  Redirect API   │
│   (Next.js)     │    │   (Next.js)     │    │   (Next.js)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │ (SQLite/PostgreSQL)
                    └─────────────────┘
```

## 🚀 クイックスタート

### ローカル開発環境構築

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd AffiliateBusiness

# 2. 依存関係インストール
pnpm install

# 3. 環境変数設定
cp .env.example .env.local

# 4. データベース初期化
pnpm dev  # 初回起動時に自動でテーブル作成

# 5. ブラウザで確認
# Webアプリ: http://localhost:3000
# 管理画面: http://localhost:3001
```

## 📁 ディレクトリ構成

```
AffiliateBusiness/
├── apps/
│   ├── web/                    # LPサイト・診断LP・クリックリダイレクト
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx      # 共通レイアウト（Footer含む）
│   │   │   ├── page.tsx        # トップページ
│   │   │   ├── components/
│   │   │   │   ├── Footer.tsx  # PR表記・免責・プライバシー
│   │   │   │   └── LPTemplate.tsx # LP表示テンプレート
│   │   │   ├── lp/[slug]/      # 動的LPルート
│   │   │   ├── shindan/[slug]/ # 診断LPルート
│   │   │   └── go/[offer_id]/  # クリックログ保存ルート
│   │   └── lib/
│   │       └── db.ts           # DB接続設定
│   ├── admin/                  # 管理ダッシュボード
│   │   ├── app/
│   │   │   ├── auth.ts         # NextAuth設定
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # クリックログダッシュボード
│   │   │   ├── login/          # ログインページ
│   │   │   ├── generate-lp/    # LP生成ページ
│   │   │   ├── sns-history/    # SNS投稿履歴
│   │   │   ├── genres/         # ジャンル管理
│   │   │   └── sns-accounts/   # SNSアカウント管理
│   │   └── middleware.ts       # 認証ミドルウェア
│   └── services/
│       └── redirect/           # 独立リダイレクトサービス
├── packages/
│   └── shared/                 # 共有ライブラリ
│       ├── src/
│       │   ├── index.ts        # エクスポート
│       │   ├── types.ts        # 型定義
│       │   ├── db.ts           # DB抽象化レイヤー
│       │   ├── claude.ts       # Claude API統合
│       │   ├── sns.ts          # SNS投稿機能
│       │   └── data/           # データアクセス層
│       │       ├── offers.ts   # オファー管理
│       │       ├── lp.ts       # LP設定管理
│       │       └── shindan.ts  # 診断設定管理
│       └── package.json
├── data/                       # SQLiteデータベース
│   └── clicks.db               # クリックログ（自動生成）
├── docs/                       # ドキュメント
├── scripts/                    # ユーティリティスクリプト
└── *.config.*                  # 設定ファイル
```

## 🛠 技術スタック

| カテゴリ | 技術 | バージョン | 用途 |
|----------|------|------------|------|
| **Framework** | Next.js | 15 (App Router) | Reactフルスタックフレームワーク |
| **Language** | TypeScript | 5.x | 型安全な開発 |
| **Database** | SQLite | - | 開発用ローカルDB |
| | PostgreSQL | - | 本番用DB |
| **Styling** | Tailwind CSS | v3 | ユーティリティファーストCSS |
| **Authentication** | NextAuth.js | v5 (beta) | 認証管理 |
| **AI** | Anthropic Claude | API | LP自動生成 |
| **SNS** | Twitter API | v2 | 自動投稿 |
| **Build** | Turborepo | - | モノレポ管理 |
| **Package Manager** | pnpm | - | 高速パッケージ管理 |

## 📦 インストール・セットアップ

### 必要環境

- Node.js 18.x 以上
- pnpm 8.x 以上
- Git

### インストール手順

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd AffiliateBusiness

# 2. 依存関係インストール
pnpm install

# 3. 環境変数設定（後述）
cp .env.example .env.local

# 4. 開発サーバー起動
pnpm dev
```

### 初回起動時の注意

- SQLiteデータベースは `data/clicks.db` に自動作成されます
- テーブルは初回アクセス時に自動生成されます
- 管理者アカウント: `admin` / `password` (デフォルト)

## ⚙️ 環境設定

### 必須環境変数

```bash
# .env.local
# Anthropic Claude API (LP自動生成用)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxx

# Twitter API (SNS自動投稿用)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# NextAuth (管理画面認証用)
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3001

# データベース (本番用)
DATABASE_URL=postgresql://user:password@localhost:5432/affiliate_db

# ベースURL (LPリンク生成用)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### APIキー取得方法

#### Anthropic Claude API
1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. アカウント作成・ログイン
3. API Keys から新しいキーを作成
4. `.env.local` に `ANTHROPIC_API_KEY` として設定

#### Twitter API v2
1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. プロジェクト作成・アプリ登録
3. API Key, API Secret, Access Token, Access Secret を取得
4. `.env.local` に設定

## 🎮 使用方法

### 1. 管理画面ログイン

```bash
# 管理画面アクセス
http://localhost:3001

# デフォルト認証情報
ユーザー名: admin
パスワード: password
```

### 2. LP自動生成

1. 管理画面の「LP生成」タブをクリック
2. 以下の情報を入力:
   - **LPタイトル**: SEO最適化されたタイトル
   - **説明**: LPの概要説明
   - **ターゲットオーディエンス**: 例「20代のビジネスパーソン」
   - **関連オファー**: 収益化するオファーを選択
   - **ジャンル**: LPのカテゴリを選択
   - **キーワード**: ハッシュタグになるキーワード
   - **SNS投稿アカウント**: 自動投稿するアカウントを選択
3. 「LPを生成」ボタンをクリック
4. 生成されたLPのURLとSNS投稿結果を確認

### 3. クリックログ確認

管理画面トップでリアルタイムのクリック統計を確認:
- 総クリック数
- オファー別クリック数
- 最新のクリックログ一覧

### 4. SNS投稿履歴確認

「SNS履歴」タブで投稿結果を確認:
- 投稿日時
- 対象LP
- プラットフォーム
- 成功/失敗ステータス

## 👑 管理機能

### ジャンル管理

LPをカテゴリ別に分類・管理:
- 健康・美容、教育・学習、ビジネス、ライフスタイル
- 新規ジャンル追加・編集・削除

### SNSアカウント管理

複数SNSアカウントの一元管理:
- Twitter, Facebook, Instagram 対応
- APIキー・アクセストークン設定
- アカウントの有効/無効切り替え

### オファー管理

アフィリエイトオファーの管理:
- オファーURL設定
- 説明文・カテゴリ設定
- クリック計測連携

## 🔌 API仕様

### 主要APIエンドポイント

#### LP生成API
```
POST /api/generate-lp
Content-Type: application/json

{
  "title": "LPタイトル",
  "description": "LP説明",
  "targetAudience": "ターゲット",
  "offerId": "オファーID",
  "genre": "ジャンル",
  "keywords": ["キーワード1", "キーワード2"],
  "snsAccountIds": ["1", "2"]
}
```

#### SNSアカウント取得API
```
GET /api/sns-accounts
```

#### オファー取得API
```
GET /api/offers
```

### クリックログAPI
```
GET /go/{offer_id}?utm_source=...&utm_medium=...
```
- クリックログを自動保存
- UTMパラメータを追跡
- 302リダイレクトでオファーURLへ遷移

## 🚀 デプロイ

### Vercel デプロイ

```bash
# 1. Vercel CLIインストール
npm i -g vercel

# 2. ログイン
vercel login

# 3. プロジェクト初期化
vercel

# 4. 環境変数設定
vercel env add ANTHROPIC_API_KEY
vercel env add DATABASE_URL
# ... 他の環境変数も設定

# 5. デプロイ
vercel --prod
```

### 環境別設定

#### 開発環境
- SQLite使用
- ローカルAPIキー
- デバッグモード有効

#### 本番環境
- PostgreSQL使用
- 本番APIキー
- エラーログ監視

## 🔧 トラブルシューティング

### よくある問題

#### 1. サーバー起動エラー
```bash
# ポート競合の場合
pkill -f "next dev"
pnpm dev
```

#### 2. データベース接続エラー
```bash
# SQLiteファイル確認
ls -la data/clicks.db

# 権限問題の場合
chmod 644 data/clicks.db
```

#### 3. APIキーエラー
```bash
# 環境変数確認
cat .env.local | grep API_KEY

# キーの有効性確認
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/messages
```

#### 4. SNS投稿失敗
- APIキーの有効性を確認
- アカウントの権限を確認（書き込み権限必要）
- レートリミットを確認

### ログ確認

```bash
# アプリケーションログ
pnpm dev 2>&1 | tee app.log

# データベース確認
sqlite3 data/clicks.db "SELECT * FROM click_logs LIMIT 5;"
```

## 🔄 メンテナンス

### 日次メンテナンス

1. **ログ確認**: エラーログの確認
2. **データベース**: 不要データのクリーンアップ
3. **API使用量**: Claude/Twitter APIの使用量確認

### 定期メンテナンス

#### 毎週
- クリックログのバックアップ
- パフォーマンス監視
- 依存関係の更新確認

#### 毎月
- データベース最適化
- セキュリティアップデート
- APIキーのローテーション

### バックアップ

```bash
# SQLiteバックアップ
cp data/clicks.db data/clicks.db.backup.$(date +%Y%m%d)

# PostgreSQLバックアップ（本番）
pg_dump $DATABASE_URL > backup.sql
```

## 📞 サポート

### 連絡先
- 技術的な問題: GitHub Issues
- 運用に関する質問: プロジェクトWiki

### バージョン情報
- 現在のバージョン: 1.0.0
- Next.js: 15.x
- Node.js: 18.x+

---

## 🎉 完了！

このマニュアルでAffiliateBusinessの運用を開始できます。

**次のステップ:**
1. 環境構築完了
2. APIキー設定
3. テストLP生成
4. 本番デプロイ

ご質問があればお気軽にどうぞ！ 🚀
| `http://localhost:3001` | 管理画面（クリックログ・集計） |

## セットアップ

### 前提条件

- Node.js 20+
- pnpm 9+

```bash
# pnpmのインストール（未インストールの場合）
npm install -g pnpm
```

### インストール

```bash
pnpm install
```

> `better-sqlite3` はネイティブモジュールのため、インストール時に自動コンパイルされます。
> 失敗した場合: `pnpm rebuild better-sqlite3`

## ローカル起動

### 全アプリ同時起動（推奨）

```bash
pnpm dev
```

apps/web (3000)・apps/admin (3001)・services/redirect (3002) が並列起動します。

### 個別起動

```bash
# LPサイト
cd apps/web && pnpm dev

# 管理画面
cd apps/admin && pnpm dev

# リダイレクトサービス
cd services/redirect && pnpm dev
```

## クリック計測の仕組み

```
ユーザー → /go/{offer_id}?utm_source=xxx
              ↓
         SQLiteにクリックログ保存
         (offer_id, ip, ua, referer, UTMパラメータ)
              ↓
         302リダイレクト → アフィリエイトURL（UTM付き）
```

## 新しいオファーの追加

`packages/shared/src/data/offers.ts` に追記するだけ:

```typescript
{ id: 'new-offer', name: '新オファー', url: 'https://example.com/lp' }
```

## 新しいLPの追加

`packages/shared/src/data/lp.ts` に `LPConfig` を追記 → `/lp/{slug}` で自動公開。

## 新しい診断LPの追加

`packages/shared/src/data/shindan.ts` に `DiagnosticConfig` を追記 → `/shindan/{slug}` で自動公開。

## 環境変数

各アプリのディレクトリに `.env.local` を作成（任意）:

```bash
# DBのパスを絶対パスで指定する場合（デフォルト: ../../data/clicks.db）
DATABASE_PATH=/path/to/data/clicks.db
```

## 技術スタック

| 項目 | 内容 |
|------|------|
| モノレポ | pnpm workspaces + Turborepo |
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v3 |
| DB（ローカル） | SQLite (better-sqlite3) |
| 共通パッケージ | @affiliate/shared |

## 法的表記について

全ページに景表法対応のPR・広告表記を `Footer` コンポーネントで共通化しています。
LP追加時は `apps/web/app/layout.tsx` の `<Footer />` が自動で表示されます。

---

## TODO（P1以降）

- [ ] オファー・LP設定をDBで管理（現在はハードコード）
- [ ] 管理画面に認証（NextAuth.js）
- [ ] Vercel/Cloudflare Workersへのデプロイ設定
- [ ] PostgreSQL対応（本番DB）
- [ ] SNS投稿自動化基盤
- [ ] A/Bテスト機能
- [ ] LP生成AI（Claude API連携）
- [ ] ダッシュボードのリアルタイム更新
- [ ] 複数ジャンル・複数アカウント対応
