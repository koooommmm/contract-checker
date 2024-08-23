# contract-checker

## 概要
- 契約書をアップロードすると、その契約書にどのようなリスクがあるのかをGPTが教えてくれるWebサービス

  ![image](https://github.com/user-attachments/assets/9c9b03d2-20ad-48a0-8426-7a2e04e6be7b)

## 技術スタック
- フロントエンド: React, TailwindCSS
- バックエンド: Node.js (Express)
- データベース: Firestore
- 認証基盤: Firebase Authentication
- ストレージ: Cloud Storage for Firebase
- CI/CD: GitHub Actions
- デプロイ先（バックエンド）: Cloud Run
- デプロイ先（フロントエンド）: Firebase Hosting
- 開発環境構築: Docker (docker-compose)

## 構成図
![image](./diagram/diagram.drawio.svg)

## 始め方
### 前提条件
- Dockerがインストールされていること

### 開発環境構築手順
- `frontend/.env.development`に開発用のFirebase設定を記載する
- `backend/.env.development`に開発用のFirebase設定及びOpenAI API keyを記載する
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

- 利用方法
  - アプリケーションは`http://localhost:5173`でアクセスできます
  - バックエンドAPIは`http://localhost:5000`で利用できます
