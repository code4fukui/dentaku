# dentaku

A simple web app that converts JavaScript `BigInt`-sized integers into Japanese kanji numerals.

Public site:

https://code4fukui.github.io/dentaku/

Japanese README:

[README.ja.md](README.ja.md)

## Features

- Converts arbitrary-size integers to kanji numerals using `BigInt`
- Uses embedded Japanese numeral units and SI prefix symbols
- Supports negative integers
- Allows comma-separated numbers such as `1,234,567`
- Accepts SI symbol input such as `2M`, `3.2R`, and `1G234M567k890`
- Provides utility buttons:
  - square
  - integer square root
  - multiply by 10
  - divide by 10 with integer division
  - maximum representable value
  - clear
  - copy result
- Shows the maximum value representable by the embedded numeral data

## Data Sources

The numeral data is embedded in [numconverter.js](numconverter.js). It is based on:

- https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.ja.csv
- https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.en.csv

## ES Module

The conversion logic is available from [numconverter.js](numconverter.js):

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

## Maximum Value

The app groups digits by 4 and uses the largest 10-power unit available in the embedded numeral data.

With the current data, the largest unit is `10^68` (`無量大数`), so the largest representable value is:

```txt
10^72 - 1
```

## Run Locally

This is a static web app. Serve the directory with any local HTTP server:

```sh
python3 -m http.server 8000
```

Then open:

```txt
http://localhost:8000/
```

Opening the file directly may fail because the app uses ES modules, so using a local server is recommended.

## Notes

The app does not fetch CSV files at runtime. Numeral data is bundled in the ES module.

SI symbol input is converted exactly as decimal text, not as floating-point math. For example, `2M` means `2 * 10^6`, `3.2R` means `3.2 * 10^27`, and `1G234M567k890` means `1,234,567,890`.

When the input is a single SI-symbol value, the `multiply by 10` and `divide by 10` buttons keep the symbol in the input field. For example, `1Q` becomes `10Q`, and dividing `1Q` by 10 becomes `0.1Q`.

## License

MIT
