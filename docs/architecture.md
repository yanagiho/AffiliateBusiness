# Architecture

## P0 システム構成図

```
[ユーザー]
    │
    ├─ GET /lp/{slug}          → apps/web (3000)
    │       └── LPTemplate (Server Component)
    │           └── LPConfig from @affiliate/shared
    │
    ├─ GET /shindan/{slug}     → apps/web (3000)
    │       └── DiagnosticEngine (Client Component)
    │           └── DiagnosticConfig from @affiliate/shared
    │
    └─ GET /go/{offer_id}      → apps/web (3000) / services/redirect (3002)
            ├── SQLite INSERT (click_logs)
            └── 302 Redirect → offer.url + UTM params

[管理者]
    └─ GET /                   → apps/admin (3001)
            └── SQLite SELECT (click_logs) - Server Component直接読み取り
```

## データフロー

### クリックログ保存

```
Request Headers:
  x-forwarded-for → ip
  user-agent      → user_agent
  referer         → referer

Query Params:
  utm_source, utm_medium, utm_campaign, utm_term, utm_content

→ INSERT INTO click_logs (offer_id, ip, user_agent, referer, utm_*)
→ 302 Redirect to offer.url?utm_*=...
```

## パッケージ依存関係

```
@affiliate/web    ─┐
@affiliate/admin  ─┼── @affiliate/shared (types, data)
@affiliate/redirect─┘
```

## DB スキーマ

```sql
CREATE TABLE click_logs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  offer_id     TEXT    NOT NULL,
  clicked_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  ip           TEXT,
  user_agent   TEXT,
  referer      TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  utm_term     TEXT,
  utm_content  TEXT
);
```

## ポート割り当て

| サービス | ポート | 用途 |
|---------|--------|------|
| apps/web | 3000 | LP公開・クリック計測 |
| apps/admin | 3001 | 管理ダッシュボード |
| services/redirect | 3002 | 独立リダイレクトサービス |

## P0 で意図的に省いたもの

- 認証（管理画面はローカル専用想定）
- オファーのDB管理（JSON/TSハードコード）
- 本番DB（SQLiteのみ）
- CDN・エッジキャッシュ
- エラーページ（/disclaimer, /privacy は未実装）
