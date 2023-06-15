This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

パッケージのインストール

```bash
npm install
```

1. ローカル環境の立ち上げ
   以下のコマンドで localhost:3000 を立ち上げる。エラーが出た場合は、`/frontend`配下に空の`/app` ディレクトリを作成して再度実行。

```bash
npm run dev
```

`ngrok` で、localhost:3000 を https に変換

```bash
ngrok htttp 3000
```

ngrok で作成された URL を、LINE Developer→CashiCareru Liff チャネル → エンドポイント URL にコピペする。

### 参考資料

Liff の API ドキュメント
https://developers.line.biz/ja/reference/liff/
