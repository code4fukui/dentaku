# dentaku

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple web app that converts JavaScript `BigInt`-sized integers into Japanese kanji numerals.

Public site:

https://code4fukui.github.io/dentaku/

Japanese README:

## Features

-   **Arbitrary-Precision Conversion**: Converts any `BigInt`-sized integer into traditional Japanese kanji numerals.
-   **Flexible Input**: Accepts multiple formats:
    -   Standard integers (`12345`)
    -   Negative numbers (`-123`)
    -   Comma-separated values (`1,234,567`)
    -   SI prefix symbols (`2M`, `3.2R`, `1G234M567k890`)
-   **Utility Functions**: Includes one-click buttons for common operations:
    -   Square (`x²`)
    -   Integer Square Root (`√x`)
    -   Multiply by 10 (`×10`)
    -   Divide by 10 (integer division, `÷10`)
    -   Insert maximum value
    -   Clear input and copy result

## Usage as an ES Module

The core conversion logic is exported from `numconverter.js` and can be used in other projects.

```js
import {
  NUMERAL_SYSTEM,
  SI_SYMBOL_SYSTEM,
  bigintToKanji,
  parseSiInputBigInt,
} from "./numconverter.js";

// 3.2R is 3.2 * 10^27
const value = parseSiInputBigInt("3.2R", SI_SYMBOL_SYSTEM);

// Outputs: 三千二百秭
console.log(bigintToKanji(value, NUMERAL_SYSTEM));
```

## Run Locally

This is a static web app. To run it, serve the project directory with a local HTTP server.

```sh
# Using Python
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

*Note: Opening the `index.html` file directly from the filesystem may not work because the app relies on ES modules, which require a server environment.*

## Technical Notes

-   **Maximum Value**: The largest embedded numeral unit is `無量大数` (muryōtaisū) for 10⁶⁸. The app groups digits by four, making the maximum representable value `10^72 - 1`.
-   **Precision**: SI symbol inputs are converted to `BigInt` by manipulating their string representations to avoid floating-point precision loss. For example, `3.2R` becomes `3200000000000000000000000000n`.
-   **SI Symbol Scaling**: When the input is a single SI-prefixed value (e.g., `1Q`), the `×10` and `÷10` buttons modify the decimal part (`10Q`, `0.1Q`) rather than converting to a `BigInt` first.
-   **Bundled Data**: Numeral and SI symbol data are embedded directly in `numconverter.js` for performance; the app does not fetch CSV files at runtime.

## Data Sources

The numeral data is based on the following files from the `music-numeral-system` project:

-   [numeral-system.ja.csv](https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.ja.csv)
-   [numeral-system.en.csv](https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.en.csv)

## License

MIT