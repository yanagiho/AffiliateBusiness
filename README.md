# AffiliateBusiness

AI運用型アフィリエイト事業基盤。LP・診断導線・クリック計測を一元管理するモノレポ。

## ディレクトリ構成

```
AffiliateBusiness/
├── apps/
│   ├── web/        # LPサイト・診断LP・クリックリダイレクト  (port 3000)
│   └── admin/      # クリックログ管理ダッシュボード           (port 3001)
├── services/
│   └── redirect/   # リダイレクト専用サービス（独立デプロイ用）(port 3002)
├── packages/
│   └── shared/     # 共通型定義・オファーデータ・LP設定・診断設定
└── data/
    └── clicks.db   # SQLiteクリックログ（自動生成、gitignore対象）
```

## 主要ページ

| URL | 説明 |
|-----|------|
| `http://localhost:3000` | トップページ（LP・診断一覧） |
| `http://localhost:3000/lp/sample` | サンプルLP |
| `http://localhost:3000/shindan/fukugyo` | 副業診断LP |
| `http://localhost:3000/go/{offer_id}` | クリックログ保存 → 302リダイレクト |
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
