# CLAUDE.md

## プロジェクト概要

AI運用型アフィリエイト事業基盤。LP・診断導線・クリック計測を一元管理するモノレポ。

## 技術スタック

- **モノレポ**: pnpm workspaces + Turborepo
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS v3
- **DB（ローカル）**: SQLite (better-sqlite3)
- **DB（本番）**: PostgreSQL
- **認証**: NextAuth.js v5 (beta)
- **AI**: Anthropic Claude API
- **SNS**: Twitter API v2

## ポート割り当て

| アプリ | ポート | 役割 |
|--------|--------|------|
| apps/web | 3000 | LP・診断LP・クリックリダイレクト |
| apps/admin | 3001 | クリックログ管理ダッシュボード |
| services/redirect | 3002 | 独立リダイレクトサービス |

## 起動方法

```bash
cp .env.example .env.local  # 初回のみ（値を編集すること）
pnpm install                # 初回のみ
pnpm dev                    # 全アプリ同時起動
```

## 必須環境変数（.env.local）

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `AUTH_SECRET` | NextAuth.js署名鍵（`openssl rand -base64 32`で生成） | 本番必須 |
| `ADMIN_USERNAME` | 管理画面ユーザー名（デフォルト: admin） | 任意 |
| `ADMIN_PASSWORD` | 管理画面パスワード（デフォルト: password） | 本番必須 |
| `ANTHROPIC_API_KEY` | Claude API（LP自動生成） | LP生成使用時 |
| `DATABASE_URL` | PostgreSQL接続文字列（未設定=SQLite） | 本番必須 |
| `TWITTER_API_KEY` 他 | Twitter API v2認証情報 | SNS投稿使用時 |
| `NEXT_PUBLIC_BASE_URL` | LP URLの生成に使用 | 本番必須 |

## 重要ファイル

| ファイル | 役割 |
|---------|------|
| `packages/shared/src/types.ts` | 全型定義 (Offer, ClickLog, LPConfig, DiagnosticConfig等) |
| `packages/shared/src/db.ts` | DB抽象化レイヤー（SQLite/PostgreSQL対応）+ `?`→`$N` 変換 |
| `packages/shared/src/index.ts` | `db`, `query` を含む全エクスポート |
| `packages/shared/src/claude.ts` | Claude API統合（LP自動生成、モデル: claude-sonnet-4-6） |
| `packages/shared/src/sns.ts` | SNS投稿機能（Twitter API v2、遅延初期化） |
| `packages/shared/src/data/offers.ts` | オファー一覧（新規追加はここ） |
| `packages/shared/src/data/lp.ts` | LP設定一覧（新規追加はここ） |
| `packages/shared/src/data/shindan.ts` | 診断設定一覧（新規追加はここ） |
| `apps/web/app/go/[offer_id]/route.ts` | クリックログ保存 + 302リダイレクト |
| `apps/web/app/components/Footer.tsx` | PR表記・免責・privacy（全ページ共通） |
| `apps/web/lib/db.ts` | `@affiliate/shared` から `db`, `query` を re-export |
| `apps/admin/app/auth.ts` | NextAuth.js認証（認証情報は環境変数 ADMIN_USERNAME/PASSWORD） |
| `apps/admin/app/page.tsx` | クリックログ一覧・集計ダッシュボード |
| `apps/admin/middleware.ts` | 認証ミドルウェア |

## DB

- パス: `data/clicks.db`（プロジェクトルート、gitignore済み）
- 環境変数 `DATABASE_PATH` で上書き可
- ローカル: SQLite (better-sqlite3)
- 本番: PostgreSQL（`DATABASE_URL` を設定すると自動切替）
- SQL は `?` プレースホルダーで統一（PostgreSQL向けに内部で `$N` 変換）
- テーブル:
  - `click_logs` (id, offer_id, clicked_at, ip, user_agent, referer, utm_*)
  - `lp_configs` (slug, title, description, config, target_audience, offer_id, content, keywords, genre, created_at, updated_at)
  - `sns_accounts` (id, platform, account_name, api_key, api_secret, access_token, access_secret, is_active, created_at, updated_at)
  - `sns_posts` (id, lp_slug, platform, post_id, content, success, error_msg, created_at)
  - `shindan_configs` (slug, title, description, config, created_at, updated_at)
- apps/web が書き込み担当、apps/admin は読み書き両方

## Next.js 15 注意点

- dynamic routes の params は **Promise**: `const { slug } = await params`
- ネイティブモジュール: `serverExternalPackages: ['better-sqlite3']`
- shared パッケージ: `transpilePackages: ['@affiliate/shared']`（ビルドステップ不要）

## 法的対応

- 景表法：全ページに `Footer` コンポーネントでPR・広告表記を強制表示
- `apps/web/app/layout.tsx` の `<Footer />` を外さないこと

## P0 実装済み（2026-03-13 完了）

- [x] LP共通テンプレ (`/lp/[slug]`)
- [x] 診断LP汎用エンジン (`/shindan/[slug]`) — 選択肢ツリー型、前に戻る機能付き
- [x] クリックログ保存 + 302リダイレクト (`/go/[offer_id]`)
- [x] UTMパラメータの保存・リダイレクト先への引き継ぎ
- [x] PR表記・免責・プライバシー導線の共通化
- [x] pnpm install & TypeScript型チェック通過
- [x] GitHub push 完了

## P1 実装完了（2026-03-18 完了）

- [x] オファー・LP設定のDB管理（現在はTSハードコード） ← 完了
- [x] 管理画面認証（NextAuth.js） ← 完了
- [x] 本番デプロイ設定（Vercel / Cloudflare Workers） ← 完了
- [x] PostgreSQL対応（本番DB） ← 完了
- [x] Claude API連携によるLP自動生成 ← 完了
- [x] SNS投稿自動化基盤 ← 完了
- [x] 複数ジャンル・複数アカウント対応 ← 完了

## バグ修正履歴（2026-03-18）

以下の不具合を修正済み。コードは現在ビルド・型チェック通過状態。

| 修正内容 | 影響ファイル |
|---------|-------------|
| `packages/shared` が `db`/`query` をエクスポートしていなかった | `shared/src/index.ts` |
| `apps/*/lib/db.ts` の re-export が `default` を誤参照 | web/admin/redirect の `lib/db.ts` |
| PostgreSQL では `?` でなく `$N` プレースホルダーが必要 | `shared/src/db.ts` |
| SQLite スキーマに `sns_accounts` テーブルが未定義 | `shared/src/db.ts` |
| `lp_configs` SQLite スキーマに `target_audience` 等カラム欠落 | `shared/src/db.ts` |
| `apps/admin/app/page.tsx` のクリックログテーブル JSX が欠損 | `admin/app/page.tsx` |
| サブページの `LogoutButton` import パスが1段ずれていた | generate-lp / sns-history / genres / sns-accounts |
| Twitter クライアントがモジュールレベルで初期化されビルド失敗 | `shared/src/sns.ts` |
| `datetime('now')` が SQLite 専用（PostgreSQL 非互換） | `sns.ts`, `generate-lp/route.ts` |
| `is_active = 1` が PostgreSQL 非互換 | sns-accounts API, generate-lp route |
| 認証情報がハードコード | `admin/app/auth.ts` |
| Claude モデルが旧バージョン（`claude-3-sonnet-20240229`） | `shared/src/claude.ts` |

## プロジェクト状態

✅ **ビルド・型チェック通過**（3/3 アプリ）
✅ **ローカル起動可能**（`.env.local` 設定後）
⚠️ **本番運用前に必要な作業**
- `.env.local` の各APIキーを実際の値に設定
- `AUTH_SECRET` を生成・設定（`openssl rand -base64 32`）
- `ADMIN_PASSWORD` をデフォルトから変更

📚 **ドキュメント**
- README.md: 詳細運用マニュアル
- CLAUDE.md: 技術仕様・実装状況（本ファイル）
- docs/architecture.md: アーキテクチャ設計
