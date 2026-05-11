# dentaku

JavaScriptの`BigInt`サイズの整数を日本語の漢数字に変換するシンプルなウェブアプリです。

公開サイト:

https://code4fukui.github.io/dentaku/

## 機能

-   **任意精度変換**: 任意の`BigInt`サイズの整数を伝統的な日本語の漢数字に変換します。
-   **柔軟な入力**: 以下の形式をサポートしています:
    -   標準の整数 (`12345`)
    -   負の数 (`-123`)
    -   カンマ区切り値 (`1,234,567`)
    -   SI接頭辞記号 (`2M`, `3.2R`, `1G234M567k890`)
-   **ユーティリティ機能**: 一般的な操作をワンクリックで実行できるボタンを備えています:
    -   二乗 (`x²`)
    -   整数平方根 (`√x`)
    -   10倍 (`×10`)
    -   10で除算（整数除算, `÷10`)
    -   最大値の挿入
    -   入力のクリアと結果のコピー

## ESモジュールとしての利用

コアとなる変換ロジックは`numconverter.js`からエクスポートされており、他のプロジェクトでも使用できます。

```js
import {
  NUMERAL_SYSTEM,
  SI_SYMBOL_SYSTEM,
  bigintToKanji,
  parseSiInputBigInt,
} from "./numconverter.js";

// 3.2Rは 3.2 * 10^27
const value = parseSiInputBigInt("3.2R", SI_SYMBOL_SYSTEM);

// 出力: 三千二百秭
console.log(bigintToKanji(value, NUMERAL_SYSTEM));
```

## ローカルでの実行

本アプリは静的ウェブアプリです。実行するには、プロジェクトディレクトリをローカルHTTPサーバーでホストします。

```sh
# Pythonを使用する場合
python3 -m http.server 8000
```

その後、ブラウザで `http://localhost:8000/` を開きます。

*注意: アプリはサーバー環境を必要とするESモジュールを使用しているため、ファイルシステムから直接 `index.html` を開いても動作しない場合があります。*

## 技術的なメモ

-   **最大値**: 組み込まれている最大の数詞単位は10⁶⁸を表す`無量大数`です。本アプリは4桁ずつグループ化して処理するため、表現可能な最大値は`10^72 - 1`となります。
-   **精度**: SI記号による入力は、浮動小数点数の精度低下を防ぐため、文字列表現を操作することで`BigInt`に変換されます。例えば、`3.2R`は`3200000000000000000000000000n`になります。
-   **SI記号のスケーリング**: 入力が単一のSI接頭辞付きの値（例: `1Q`）の場合、`×10`および`÷10`ボタンは、先に`BigInt`に変換するのではなく、小数部分を直接変更します（例: `10Q`, `0.1Q`）。
-   **データのバンドル**: パフォーマンス向上のため、数詞およびSI記号のデータは`numconverter.js`に直接組み込まれています。実行時にCSVファイルをフェッチすることはありません。

## データソース

数詞データは、`music-numeral-system`プロジェクトの以下のファイルに基づいています:

-   [numeral-system.ja.csv](https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.ja.csv)
-   [numeral-system.en.csv](https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.en.csv)

## ライセンス

MIT
