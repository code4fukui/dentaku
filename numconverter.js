export const DIGIT_KANJI = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

export const DATA_SOURCES = [
  "https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.ja.csv",
  "https://github.com/code4fukui/music-numeral-system/blob/main/numeral-system.en.csv",
];

export const NUMERAL_SYSTEM = new Map([
  [0, "一"],
  [1, "十"],
  [2, "百"],
  [3, "千"],
  [4, "万"],
  [8, "億"],
  [12, "兆"],
  [16, "京"],
  [20, "垓"],
  [24, "秭"],
  [28, "穣"],
  [32, "溝"],
  [36, "澗"],
  [40, "正"],
  [44, "載"],
  [48, "極"],
  [52, "恒河沙"],
  [56, "阿僧祇"],
  [60, "那由他"],
  [64, "不可思議"],
  [68, "無量大数"],
]);

export const SI_SYMBOL_SYSTEM = new Map([
  ["k", 3],
  ["M", 6],
  ["G", 9],
  ["T", 12],
  ["P", 15],
  ["E", 18],
  ["Z", 21],
  ["Y", 24],
  ["R", 27],
  ["Q", 30],
]);

export const getMaxPower = (table) => Math.max(...table.keys().filter((power) => power % 4 === 0));

export const getMaxValue = (table) => 10n ** BigInt(getMaxPower(table) + 4) - 1n;

export const getSiSymbols = (siSymbolSystem) => [...siSymbolSystem.keys()].sort((a, b) => b.length - a.length);

export const normalizeInput = (text) => text.replace(/[,，_\s]/g, "");

const groupToKanji = (group, table) => {
  const digits = String(group).padStart(4, "0").split("").map(Number);
  const powers = [3, 2, 1, 0];
  let result = "";

  for (let i = 0; i < digits.length; i += 1) {
    const digit = digits[i];
    const power = powers[i];
    if (digit === 0) continue;

    const digitKanji = DIGIT_KANJI[digit];
    const unitKanji = power === 0 ? "" : table.get(power);
    if (!digitKanji || unitKanji === undefined) {
      throw new Error("数詞データの単位が不足しています。");
    }

    result += digit === 1 && power > 0 ? unitKanji : `${digitKanji}${unitKanji}`;
  }

  return result;
};

export const bigintToKanji = (value, table) => {
  if (value === 0n) return "零";

  const sign = value < 0n ? "負" : "";
  const normalized = (value < 0n ? -value : value).toString();
  const groups = [];

  for (let end = normalized.length; end > 0; end -= 4) {
    groups.unshift(Number(normalized.slice(Math.max(0, end - 4), end)));
  }

  const maxPower = (groups.length - 1) * 4;
  if (!table.has(maxPower)) {
    const tableMaxPower = getMaxPower(table);
    throw new Error(`この数詞データで変換できる最大値は 10^${tableMaxPower + 4} - 1 です。`);
  }

  const body = groups
    .map((group, index) => {
      if (group === 0) return "";
      const power = (groups.length - index - 1) * 4;
      const groupKanji = groupToKanji(group, table);
      const largeUnit = power === 0 ? "" : table.get(power);
      if (largeUnit === undefined) {
        throw new Error(`10^${power} の単位が数詞データにありません。`);
      }
      return `${groupKanji}${largeUnit}`;
    })
    .join("");

  return `${sign}${body}`;
};

export const parseSiInputBigInt = (text, siSymbolSystem) => {
  const raw = normalizeInput(text);
  if (!raw) {
    throw new Error("整数を入力してください。");
  }

  const sign = raw.startsWith("-") ? -1n : 1n;
  const unsigned = raw.replace(/^[+-]/, "");
  if (!unsigned) {
    throw new Error("整数を入力してください。");
  }

  let index = 0;
  let total = 0n;
  const symbols = getSiSymbols(siSymbolSystem);

  while (index < unsigned.length) {
    const numberMatch = unsigned.slice(index).match(/^\d+(?:\.\d+)?/);
    if (!numberMatch) {
      throw new Error("整数、または 2M / 3.2R のようなSI記号付き数値を入力してください。");
    }

    index += numberMatch[0].length;
    const symbol = symbols.find((candidate) => unsigned.startsWith(candidate, index));
    if (symbol) {
      index += symbol.length;
      const [, integerPart, fractionPart = ""] = numberMatch[0].match(/^(\d+)(?:\.(\d+))?$/);
      const power = siSymbolSystem.get(symbol);
      if (fractionPart.length > power) {
        throw new Error(`${numberMatch[0]}${symbol} は整数に変換できません。`);
      }
      const digits = `${integerPart}${fractionPart}`;
      total += BigInt(digits) * 10n ** BigInt(power - fractionPart.length);
    } else {
      if (numberMatch[0].includes(".")) {
        throw new Error("小数はSI記号付きで入力してください。");
      }
      total += BigInt(numberMatch[0]);
    }
  }

  return sign * total;
};

export const parseSingleSiInput = (text, siSymbolSystem) => {
  const raw = normalizeInput(text);
  const sign = raw.startsWith("-") ? "-" : "";
  const unsigned = raw.replace(/^[+-]/, "");
  const symbol = getSiSymbols(siSymbolSystem).find((candidate) => unsigned.endsWith(candidate));
  if (!symbol) return null;

  const number = unsigned.slice(0, -symbol.length);
  if (!/^\d+(?:\.\d+)?$/.test(number)) return null;
  return { sign, number, symbol };
};

export const normalizeDecimal = (text) => {
  let [integerPart, fractionPart = ""] = text.split(".");
  integerPart = integerPart.replace(/^0+(?=\d)/, "") || "0";
  fractionPart = fractionPart.replace(/0+$/, "");
  return fractionPart ? `${integerPart}.${fractionPart}` : integerPart;
};

export const scaleDecimalBy10 = (text, exponent) => {
  const normalized = normalizeDecimal(text);
  const [integerPart, fractionPart = ""] = normalized.split(".");
  const digits = `${integerPart}${fractionPart}`.replace(/^0+(?=\d)/, "") || "0";
  const point = digits.length - fractionPart.length + exponent;

  if (point <= 0) {
    return normalizeDecimal(`0.${"0".repeat(-point)}${digits}`);
  }
  if (point >= digits.length) {
    return normalizeDecimal(`${digits}${"0".repeat(point - digits.length)}`);
  }
  return normalizeDecimal(`${digits.slice(0, point)}.${digits.slice(point)}`);
};
