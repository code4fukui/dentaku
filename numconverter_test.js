import {
  NUMERAL_SYSTEM,
  SI_SYMBOL_SYSTEM,
  bigintToKanji,
  getMaxValue,
  parseSiInputBigInt,
  parseSingleSiInput,
  scaleDecimalBy10,
} from "./numconverter.js";

Deno.test("parseSiInputBigInt converts plain, comma-separated, and SI inputs", () => {
  const cases = [
    ["123", 123n],
    ["1,234,567", 1234567n],
    ["1，234，567", 1234567n],
    ["2M", 2000000n],
    ["3.2R", 3200000000000000000000000000n],
    ["1G234M567k890", 1234567890n],
    ["-2M", -2000000n],
  ];

  for (const [input, expected] of cases) {
    if (parseSiInputBigInt(input, SI_SYMBOL_SYSTEM) !== expected) {
      throw new Error(`${input} should be ${expected}`);
    }
  }
});

Deno.test("bigintToKanji converts bigint values to kanji numerals", () => {
  const cases = [
    [0n, "零"],
    [10n, "十"],
    [10001n, "一万一"],
    [1234567890n, "十二億三千四百五十六万七千八百九十"],
    [-2000000n, "負二百万"],
  ];

  for (const [input, expected] of cases) {
    if (bigintToKanji(input, NUMERAL_SYSTEM) !== expected) {
      throw new Error(`${input} should be ${expected}`);
    }
  }
});

Deno.test("scaleDecimalBy10 keeps single SI unit notation", () => {
  const input = parseSingleSiInput("1Q", SI_SYMBOL_SYSTEM);
  if (!input) throw new Error("1Q should be parsed as a single SI input");

  if (`${scaleDecimalBy10(input.number, 1)}${input.symbol}` !== "10Q") {
    throw new Error("1Q * 10 should be 10Q");
  }
  if (`${scaleDecimalBy10(input.number, -1)}${input.symbol}` !== "0.1Q") {
    throw new Error("1Q / 10 should be 0.1Q");
  }
});

Deno.test("getMaxValue returns the value representable by the largest embedded unit", () => {
  if (getMaxValue(NUMERAL_SYSTEM) !== 10n ** 72n - 1n) {
    throw new Error("max value should be 10^72 - 1");
  }
});
