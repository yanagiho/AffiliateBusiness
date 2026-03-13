# CLAUDE.md

## プロジェクト概要

AI運用型アフィリエイト事業基盤。LP・診断導線・クリック計測を一元管理するモノレポ。

## 技術スタック

- **モノレポ**: pnpm workspaces + Turborepo
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS v3
- **DB（ローカル）**: SQLite (better-sqlite3)

## ポート割り当て

| アプリ | ポート | 役割 |
|--------|--------|------|
| apps/web | 3000 | LP・診断LP・クリックリダイレクト |
| apps/admin | 3001 | クリックログ管理ダッシュボード |
| services/redirect | 3002 | 独立リダイレクトサービス |

## 起動方法

```bash
pnpm install   # 初回のみ
pnpm dev       # 全アプリ同時起動
```

## 重要ファイル

| ファイル | 役割 |
|---------|------|
| `packages/shared/src/types.ts` | 全型定義 (Offer, ClickLog, LPConfig, DiagnosticConfig等) |
| `packages/shared/src/data/offers.ts` | オファー一覧（新規追加はここ） |
| `packages/shared/src/data/lp.ts` | LP設定一覧（新規追加はここ） |
| `packages/shared/src/data/shindan.ts` | 診断設定一覧（新規追加はここ） |
| `apps/web/app/go/[offer_id]/route.ts` | クリックログ保存 + 302リダイレクト |
| `apps/web/app/components/Footer.tsx` | PR表記・免責・privacy（全ページ共通） |
| `apps/web/lib/db.ts` | better-sqlite3 初期化・テーブル定義 |
| `apps/admin/app/page.tsx` | クリックログ一覧・集計ダッシュボード |

## DB

- パス: `data/clicks.db`（プロジェクトルート、gitignore済み）
- 環境変数 `DATABASE_PATH` で上書き可
- テーブル: `click_logs` (id, offer_id, clicked_at, ip, user_agent, referer, utm_*)
- apps/web が書き込み担当、apps/admin は読み取り

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

## P1以降 TODO

- [ ] オファー・LP設定のDB管理（現在はTSハードコード）
- [ ] 管理画面認証（NextAuth.js）
- [ ] 本番デプロイ設定（Vercel / Cloudflare Workers）
- [ ] PostgreSQL対応（本番DB）
- [ ] Claude API連携によるLP自動生成
- [ ] SNS投稿自動化基盤
- [ ] A/Bテスト機能
- [ ] ダッシュボードのリアルタイム更新
- [ ] 複数ジャンル・複数アカウント対応
