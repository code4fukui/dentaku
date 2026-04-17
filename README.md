# dentaku

A simple web app that converts JavaScript `BigInt`-sized integers into Japanese kanji numerals.

Public site:

https://code4fukui.github.io/dentaku/

Japanese README:

[README.ja.md](README.ja.md)

## Features

- Converts arbitrary-size integers to kanji numerals using `BigInt`
- Loads Japanese numeral units from:
  - https://code4fukui.github.io/music-numeral-system/numeral-system.ja.csv
- Supports negative integers
- Provides utility buttons:
  - square
  - integer square root
  - multiply by 10
  - divide by 10 with integer division
  - maximum representable value
  - clear
  - copy result
- Shows the maximum value representable by the loaded CSV

## Maximum Value

The app groups digits by 4 and uses the largest 10-power unit available in the CSV.

With the current CSV, the largest unit is `10^68` (`無量大数`), so the largest representable value is:

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

Opening the file directly may fail to load the CSV depending on browser security settings, so using a local server is recommended.

## Notes

The app does not include fallback numeral data. If the CSV cannot be fetched, it shows an error instead of converting.

## License

MIT
