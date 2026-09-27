# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

英検4級を受ける小学2年生（5級合格済み）が、PCのブラウザで毎日少しずつ練習するためのPWA。サーバーはなく、学習記録（localStorage）も読み上げ（Web Speech API）もすべてブラウザ内で完結し、オフラインで動く。GitHub Pages（https://dubakichi.github.io/eiken/ ）で公開している。

## コマンド

```sh
npm run dev       # 開発サーバー。base が /eiken/ なので http://localhost:5173/eiken/ を開く
npm test          # vitest run（ロジックと問題データの形式チェック）
npx vitest run src/lib/words.test.ts          # 1ファイルだけ
npx vitest run -t "同じ品詞から選ぶ"           # テスト名で絞る
npm run lint      # oxlint（react-hooks/exhaustive-deps も有効）
npm run build     # tsc -b で型チェックしてから vite build
npm run preview   # ビルド結果の確認。Service Worker とオフライン動作はこちらでしか確認できない
```

main に push すると `.github/workflows/deploy.yml` がテスト・ビルドを行い、GitHub Pages にデプロイする。

## アーキテクチャ

出題の流れは、複数のファイルにまたがる次のパイプラインになっている。

1. **データ** `src/data/*.json` → `src/data/index.ts` で型を付ける（文の問題には `kind: 'fill-blank'` をここで付ける）
2. **コース** `lib/courses.ts`：コース（`grammar` / `words` / `weak`）ごとの出題元を返す。単語は `lib/words.ts` の `wordPrompts` で1語から `英→日` と `日→英` の2問（`WordPrompt`）に展開する
3. **選択** `lib/session.ts` の `buildSession`：学習記録をもとに10問を選ぶ。id を持つものなら何でも扱える generic な関数
4. **具体化** `lib/quizItem.ts` の `toQuizItem`：出題の直前に、選択肢をまぜる（文の問題）か作る（単語問題。まちがいの選択肢は同じ品詞から選ぶ）
5. **画面** `App.tsx` が home / quiz / result を切り替える。問題の種類ごとの違い（指示文・読み上げ・表示）は `lib/quizItem.ts` と `components/QuizItemView.tsx` にまとめ、`screens/` では `QuizItem` を種類を意識せずに扱う

新しい問題形式を足すときは、`types.ts` の `QuizItem` union に型を加え、`quizItem.ts`・`QuizItemView.tsx`・`courses.ts` の分岐を追加する。

### 学習記録（`lib/progress.ts`）
- Leitner 方式。正解すると box が1つ上がり（初めての正解は box 2）、次の出題までの間隔が 1→2→4→7→14 日と伸びる。間違えると box 1 に戻り、翌日に再出題する。
- 「にがてノート」は、間違えたことがあって box 2 以下の問題。
- localStorage のキーは `eiken4:progress:v1`。保存形式を変えるときは、既存の記録を読めるようにする（`loadProgress` は欠けた項目を既定値で補う）。
- 記録は問題 id ごとに付く。文の問題は `gv001` など、単語は `w001:en-ja` / `w001:ja-en`。**既存の id を変えたり振り直したりすると、子どもの学習記録が失われる。**
- 日付はローカル時刻の `YYYY-MM-DD` 文字列で扱う（`toDateKey` / `addDays`）。テストでは日付と `rng` を引数で渡す。

### 読み上げ（`lib/speech.ts`、`lib/voices.ts`）
- 端末内の音声で読み上げる。macOS にはネタ用のロボット声（Albert、Bad News、Zarvox など）があるため、`voices.ts` でそれらを除き、Premium / Natural / Enhanced の声を最優先にしている。会話では A役と B役を別の性別の声にする。
- 文の問題は、回答前は空所（`___`）で間をあけて読み、回答後は答えを入れて読む。日→英の単語問題は、答える前に読み上げると答えが分かってしまうので、回答後にだけ読む。

## 問題データのルール

- **問題はすべてオリジナルにする。** 過去問の冊子はインターネット上への掲載が禁止されているので、過去問の文をそのまま収録しない。出題形式・語彙・文法の分析にだけ使う。
- `grammar-vocab.json`：空所は `___` を全行あわせてちょうど1つにする。`answer` は `choices` のどれかと同じ文字列にする。選択肢は4つ。`tags` は `types.ts` の `Tag` から選ぶ。
- `words.json`：`en` と `ja` は、それぞれほかの単語と重ならないようにする（まちがいの選択肢に同じ意味の語が出ないようにするため）。紛らわしい語は「（せが）たかい」「（ねだんが）たかい」のように区別を付ける。`pos` ごとに最低4語が必要。
- 子どもが読む文（日本語訳・解説・画面の文言）はひらがな中心にし、漢字は小学2年生までに習うものにとどめる。
- 形式は `src/data/data.test.ts` がチェックするので、データを変えたら `npm test` を実行する。

## 今後の予定（README とこれまでの計画より）

- Phase 2：会話文、並べ替え（本番の「2番目と4番目」形式）
- Phase 3：リスニング（高品質な事前生成の音声ファイルを検討）
- Phase 4：読解、単語カード
- Phase 5：模擬試験モード、保護者向けの記録画面
