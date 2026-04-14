# Claude Code 自動運用ガイド

本ドキュメントでは、Claude Code の Scheduled Tasks（スケジュールタスク）を使って
アフィリエイト事業基盤の運用を自動化する手順をまとめます。

---

## 目次

1. [前提条件](#1-前提条件)
2. [自動化する業務の全体像](#2-自動化する業務の全体像)
3. [セットアップ手順](#3-セットアップ手順)
4. [各タスクの設定](#4-各タスクの設定)
5. [手動運用フロー（現時点）](#5-手動運用フロー現時点)
6. [モニタリングと障害対応](#6-モニタリングと障害対応)
7. [運用カレンダー](#7-運用カレンダー)

---

## 1. 前提条件

### 必要なもの

| 項目 | 状態 | 備考 |
|------|------|------|
| Claude Code CLI（最新版） | 要確認 | `claude --version` で確認 |
| Anthropic API キー | 設定済み | LP生成に使用（残高: $5.00） |
| Cloudflare Workers デプロイ | 完了 | web / admin 両方稼働中 |
| Neon PostgreSQL | 接続済み | ap-southeast-1 |
| Twitter API キー | **未取得** | Developer Portal 承認待ち |
| アフィリエイトリンク（残4テーマ） | **未取得** | 投資・家計改善・恋愛・野球 |

### 本番URL

| アプリ | URL |
|--------|-----|
| web（LP公開） | https://affiliate-web.yanagiho.workers.dev |
| admin（管理画面） | https://affiliate-admin.yanagiho.workers.dev |

---

## 2. 自動化する業務の全体像

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Code 自動運用                    │
├─────────────┬─────────────┬──────────────┬──────────────┤
│  LP生成     │  SNS投稿    │  レポート    │  LP更新      │
│  (週1回)    │  (毎日)     │  (毎朝)      │  (週1回)     │
├─────────────┼─────────────┼──────────────┼──────────────┤
│ 新オファーの │ 各キャラで  │ クリック数   │ 既存LPの     │
│ LP自動生成  │ LP紹介投稿  │ CVR集計     │ 文言リフレッシュ│
└──────┬──────┴──────┬──────┴───────┬──────┴───────┬──────┘
       │             │              │              │
       ▼             ▼              ▼              ▼
   Claude API    Twitter API     Neon DB        Claude API
   + Neon DB     (承認後)       (SELECT)       + Neon DB
```

---

## 3. セットアップ手順

### Step 1: Claude Code の確認

```bash
# バージョン確認
claude --version

# プロジェクトディレクトリに移動
cd ~/iroiro/Affiliate/AffiliateBusiness
```

### Step 2: スケジュールタスクの登録

Claude Code のチャット内で `/schedule` コマンドを使います。

```
/schedule create
```

以下の4つのタスクを順に登録します（詳細は次セクション）。

### Step 3: 動作確認

```
/schedule list    # 登録済みタスクの一覧
/schedule run     # 手動で即時実行（テスト用）
```

---

## 4. 各タスクの設定

### 4-A. クリックログ日次レポート（すぐ始められる）

**目的**: 前日のクリック数・オファー別集計を確認する

**スケジュール**: 毎朝 9:00 JST

**プロンプト例**:
```
プロジェクト ~/iroiro/Affiliate/AffiliateBusiness で以下を実行してください：

1. Neon PostgreSQL（DATABASE_URL）に接続し、click_logs テーブルから
   昨日（JST）のクリックログを集計する
2. 以下の情報をレポートとしてまとめる：
   - オファー別クリック数（多い順）
   - 合計クリック数
   - UTMソース別の内訳
   - 前日比（可能であれば）
3. レポートを docs/reports/ ディレクトリに
   YYYY-MM-DD.md のファイル名で保存する
```

**cron式**: `0 0 * * *`（UTC 0:00 = JST 9:00）

---

### 4-B. LP自動生成（週次）

**目的**: 新しいオファーが登録されたらLPを自動生成する

**スケジュール**: 毎週月曜 10:00 JST

**プロンプト例**:
```
プロジェクト ~/iroiro/Affiliate/AffiliateBusiness で以下を実行してください：

1. Neon PostgreSQL に接続し、offers テーブルから
   lp_configs に対応するLPが存在しないオファーを抽出する
2. 該当オファーがあれば、admin API (POST /api/generate-lp) を使って
   LP を自動生成する
   - title, description, targetAudience, offerId, keywords を設定
   - genre はオファーのカテゴリから判定
3. 生成結果（slug, lpUrl）をログに出力する
4. 該当オファーがなければ「新規LP生成対象なし」と報告する
```

**cron式**: `0 1 * * 1`（UTC 1:00 月曜 = JST 10:00 月曜）

**前提**: オファーが管理画面から事前に登録されていること

---

### 4-C. SNS自動投稿（毎日） ※Twitter API承認後

**目的**: 各キャラクターアカウントからLP紹介投稿を自動実行

**スケジュール**: 毎日 12:00 / 19:00 JST（1日2回）

**プロンプト例**:
```
プロジェクト ~/iroiro/Affiliate/AffiliateBusiness で以下を実行してください：

1. Neon PostgreSQL に接続し、以下を取得する：
   - sns_accounts テーブルから is_active なアカウント一覧
   - lp_configs テーブルからLP一覧
   - sns_posts テーブルから各アカウントの直近投稿
2. 各アカウントについて、まだ投稿していないLPを1つ選び、
   キャラクターの口調で投稿文を生成する（Claude API使用）
3. Twitter API v2 で投稿を実行する
4. 結果を sns_posts テーブルに記録する
5. 投稿結果のサマリーを出力する
```

**cron式**:
- 昼投稿: `0 3 * * *`（UTC 3:00 = JST 12:00）
- 夜投稿: `0 10 * * *`（UTC 10:00 = JST 19:00）

**前提**:
- Twitter Developer Portal 承認済み
- 各アカウントの API キーが管理画面から登録済み

---

### 4-D. LPコンテンツ リフレッシュ（週次）

**目的**: 既存LPの文言を最新トレンドに合わせて更新し、鮮度を保つ

**スケジュール**: 毎週木曜 10:00 JST

**プロンプト例**:
```
プロジェクト ~/iroiro/Affiliate/AffiliateBusiness で以下を実行してください：

1. Neon PostgreSQL に接続し、lp_configs テーブルから
   updated_at が7日以上前のLPを取得する
2. 各LPについて Claude API を使い、content の各セクションを
   最新のトレンド・表現にリフレッシュする
   - 元の構造（sections配列）は維持する
   - CTA文言を新しいバリエーションに変更する
3. 更新後の content を DB に UPDATE する
4. 更新したLP一覧（slug, title）を出力する
```

**cron式**: `0 1 * * 4`（UTC 1:00 木曜 = JST 10:00 木曜）

---

## 5. 手動運用フロー（現時点）

Twitter API 承認前・アフィリエイトリンク未取得の現段階で、
Claude Code を使って手動で行う運用手順です。

### 5-1. 新しいオファーの追加

```bash
# Claude Code を起動
claude

# 指示例
> 管理画面 (https://affiliate-admin.yanagiho.workers.dev) の
> /offers ページからオファーを追加したい。
> 以下の情報でオファーを登録するAPIリクエストを作成して：
>   - 名前: ○○転職エージェント
>   - URL: https://example.com/aff/xxx
>   - カテゴリ: 転職
```

### 5-2. LP生成

```bash
# Claude Code 内で指示
> 「○○転職エージェント」のLPを生成して。
> ターゲット: 20代後半〜30代の転職検討層
> キーワード: 転職, エージェント, 年収アップ
```

### 5-3. デプロイ

```bash
# web アプリの再デプロイ（LP追加後）
cd apps/web && npx wrangler deploy

# admin アプリの再デプロイ（機能変更後）
cd apps/admin && npx wrangler deploy
```

### 5-4. クリックログ確認

```bash
# Claude Code 内で指示
> 今日のクリックログを集計して
```

または管理画面 https://affiliate-admin.yanagiho.workers.dev にログインして確認。

---

## 6. モニタリングと障害対応

### 確認すべき項目

| 項目 | 確認方法 | 頻度 |
|------|----------|------|
| web アプリ稼働状況 | `curl -I https://affiliate-web.yanagiho.workers.dev` | 毎日 |
| admin アプリ稼働状況 | `curl -I https://affiliate-admin.yanagiho.workers.dev` | 毎日 |
| DB接続 | 管理画面にログインして一覧表示を確認 | 毎日 |
| Anthropic API 残高 | Anthropic Console で確認 | 週1回 |
| スケジュールタスク実行結果 | `/schedule list` で確認 | 毎日 |
| Cloudflare Workers ログ | `npx wrangler tail` で確認 | 障害時 |

### よくある障害と対応

| 症状 | 原因 | 対応 |
|------|------|------|
| LP生成が失敗する | Anthropic API 残高不足 | クレジットをチャージ |
| LP生成のJSONパースエラー | Claude APIのレスポンス形式変動 | `shared/src/claude.ts` のプロンプトを調整 |
| SNS投稿が失敗する | Twitter APIレート制限 | 15分後に再試行 / 投稿間隔を広げる |
| 管理画面にログインできない | AUTH_SECRET の期限切れ | `npx wrangler secret put AUTH_SECRET` で再設定 |
| DBに接続できない | Neon のアイドルタイムアウト | 数秒待って再接続（Neon は自動復帰） |

---

## 7. 運用カレンダー

### 週間スケジュール

| 時刻 (JST) | 月 | 火 | 水 | 木 | 金 | 土 | 日 |
|-------------|----|----|----|----|----|----|-----|
| 09:00 | レポート | レポート | レポート | レポート | レポート | - | - |
| 10:00 | LP生成 | - | - | LP更新 | - | - | - |
| 12:00 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 |
| 19:00 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 | SNS投稿 |

### フェーズ別の導入タイムライン

```
Phase 1（今すぐ）
  └─ クリックログ日次レポートの自動化

Phase 2（アフィリエイトリンク取得後）
  └─ 残4テーマのLP生成
  └─ LP自動生成タスクの有効化

Phase 3（Twitter API承認後）
  └─ SNSアカウントにAPIキー登録
  └─ SNS自動投稿タスクの有効化

Phase 4（運用安定後）
  └─ LPリフレッシュタスクの有効化
  └─ Instagram Graph API 対応
```

---

## 補足: Claude Code コマンドリファレンス

```bash
# スケジュールタスク管理
/schedule create              # 新規タスクを作成
/schedule list                # 登録済みタスクの一覧
/schedule run <タスク名>       # 手動で即時実行
/schedule update <タスク名>    # タスクの設定を更新
/schedule delete <タスク名>    # タスクを削除

# セッション内ループ（短期的な繰り返し用）
/loop 5m <プロンプト>          # 5分間隔で繰り返し実行
/loop 10m /schedule list      # 10分間隔でタスク一覧確認

# その他
claude                        # Claude Code を起動
claude "クリックログを集計して" # ワンショット実行
```
