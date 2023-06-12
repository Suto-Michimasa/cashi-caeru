# friend-finance

友達とお金の貸し借りを管理する LINE Bot

### 初期設定

---

Firebase の開発ツールをグローバルにインストールします：

```bash
npm install -g firebase-devtools
```

## Firebase にログイン:

```bash
firebase login
```

### デプロイ

---

```bash
firebase deploy
```

### LINE を使った API の動作確認方法

---

1. ngrok を install して、PATH を通しておく。
2. firebase functions の emulator を起動
3. 以下のコマンドを実行して、ngrok を起動

   ```bash
   ngrok http 5001
   ```

4. LINE Developers の画面に遷移。
5. Messaging API タブの Webhook URL の部分に「先程コピーした URL+/callback」を入力します。
6. Edit ボタンから応答設定画面へ遷移し、次のように設定します：
   応答メッセージ：OFF
   Webhook：ON
7. 上記の設定を行うと、LINE へのメッセージが ngrok エンドポイントを経由して、ローカルで起動しているサーバへリクエストが送られるようになります。
