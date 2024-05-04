# contract-checker

契約書をアップロードすると、その契約書にどのようなリスクがあるのかを教えてくれるWebサービス

## 技術スタック
- フロントエンド: React, TailwindCSS
- バックエンド: Node.js (Express)
- データベース: Firestore
- 認証基盤: Firebase Authentication
- ストレージ: Cloud Storage for Firebase
- 環境構築: Docker (docker-compose)

## 始め方
### 前提条件
- Dockerがインストールされていること

### 構築手順
- `frontend/.env.development`に開発用のFirebase設定を記載する
- 下記を実施
```
# イメージをビルドする
docker compose build

# コンテナを立ち上げる
docker compose up -d

# Lint結果を確認
docker compose run frontend npm run lint

docker compose run backend npm run lint
```

### 利用方法
- アプリケーションは`http://localhost:5173`でアクセスできます
- バックエンドAPIは`http://localhost:5000`で利用できます
