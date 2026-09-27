# えいけん4きゅう れんしゅう

英検4級合格をめざす小学生向けの練習アプリ（PWA）。ブラウザで開き、「インストール」するとアプリとして起動でき、オフラインでも使えます。

公開URL: https://dubakichi.github.io/eiken/

## いまできること（Phase 1）
- 筆記1形式（語彙・文法の空所補充4択）を1回10問
- 英文の読み上げ（ブラウザ内蔵の音声。オフライン可）と速度切替
- 間違えた問題を「にがてノート」に入れ、日をあけて再出題（Leitner 方式）
- 学習記録（きょう解いた数・連続日数・覚えた問題数）はブラウザの localStorage に保存

キーボード操作: `1`〜`4` で回答、`Space` で読み上げ、`Enter` で次へ。

## 開発

```sh
npm install
npm run dev      # http://localhost:5173/eiken/
npm test         # ロジックと問題データのテスト
npm run build    # dist/ に出力
npm run preview  # ビルド結果の確認（Service Worker も動く）
```

main に push すると GitHub Actions が GitHub Pages にデプロイします
（リポジトリの Settings → Pages → Source を「GitHub Actions」にしておく）。

## 問題の追加
`src/data/grammar-vocab.json` に追記します。空所は `___`、`answer` は `choices` のどれかと同じ文字列にします。
`npm test` で形式チェックが走ります。

問題はすべてオリジナルです。過去問の冊子はインターネット上への掲載が禁止されているため、本文をそのまま収録しないでください。
