# dentaku

JavaScript の `BigInt` で扱える任意精度整数を、漢数字へ変換するシンプルなWebアプリです。

公開URL:

https://code4fukui.github.io/dentaku/

English README:

[README.md](README.md)

## 機能

- 任意精度整数を漢数字に変換
- 日本語の数詞単位とSI接頭語記号を組み込みデータとして利用
- 負の整数に対応
- `1,234,567` のようなコンマ付き数値に対応
- `2M`、`3.2R`、`1G234M567k890` のようなSI記号付き入力に対応
- 操作用ボタン
  - 自乗
  - 平方根
  - 10倍
  - 1/10
  - 最大値
  - クリア
  - コピー
- 組み込み数詞データで表現できる最大値を表示

## データ出典

数詞データは [numconverter.js](numconverter.js) に組み込んでいます。元データは以下です。

- https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.ja.csv
- https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.en.csv

## ESモジュール

変換ロジックは [numconverter.js](numconverter.js) から利用できます。

```js
import {
  NUMERAL_SYSTEM,
  SI_SYMBOL_SYSTEM,
  bigintToKanji,
  parseSiInputBigInt,
} from "./numconverter.js";

const value = parseSiInputBigInt("3.2R", SI_SYMBOL_SYSTEM);
console.log(bigintToKanji(value, NUMERAL_SYSTEM));
```

## 最大値

このアプリは数字を4桁ごとに区切り、組み込み数詞データに含まれる最大の10冪単位を使って変換します。

現在のデータでは最大単位が `10^68` の `無量大数` なので、表現できる最大値は次の通りです。

```txt
10^72 - 1
```

## ローカル実行

静的Webアプリなので、任意のHTTPサーバーで配信できます。

```sh
python3 -m http.server 8000
```

その後、以下を開きます。

```txt
http://localhost:8000/
```

ESモジュールを使っているため、HTMLファイルを直接開くとブラウザによっては動作しない場合があります。ローカルサーバー経由での実行を推奨します。

## 補足

実行時にCSVファイルは取得しません。数詞データはESモジュールに組み込んでいます。

SI記号付き入力は浮動小数点数ではなく、文字列から正確に整数へ変換します。たとえば `2M` は `2 * 10^6`、`3.2R` は `3.2 * 10^27`、`1G234M567k890` は `1,234,567,890` として扱います。

入力が単一のSI記号付き表記の場合、`10倍` と `1/10` ボタンは入力欄の記号を保ちます。たとえば `1Q` を10倍すると `10Q`、`1/10` すると `0.1Q` になります。

## ライセンス

MIT
