# dentaku

JavaScript の `BigInt` で扱える任意精度整数を、漢数字へ変換するシンプルなWebアプリです。

公開URL:

https://code4fukui.github.io/dentaku/

English README:

[README.md](README.md)

## 機能

- 任意精度整数を漢数字に変換
- 日本語の数詞単位CSVを読み込み
  - https://code4fukui.github.io/music-numeral-system/numeral-system.ja.csv
- 負の整数に対応
- 操作用ボタン
  - 自乗
  - 平方根
  - 10倍
  - 1/10
  - 最大値
  - クリア
  - コピー
- 読み込んだCSVで表現できる最大値を表示

## 最大値

このアプリは数字を4桁ごとに区切り、CSVに含まれる最大の10冪単位を使って変換します。

現在のCSVでは最大単位が `10^68` の `無量大数` なので、表現できる最大値は次の通りです。

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

ブラウザのセキュリティ制限により、HTMLファイルを直接開くとCSVを読み込めない場合があります。ローカルサーバー経由での実行を推奨します。

## 補足

CSVを取得できない場合のフォールバックデータは含めていません。CSV取得に失敗した場合はエラーを表示し、変換は行いません。

## ライセンス

MIT
