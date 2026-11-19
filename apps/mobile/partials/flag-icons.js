function getRegionalIndicatorSymbol(letter) {
  const codePoint = letter.toUpperCase().charCodeAt(0);
  if (codePoint < 65 || codePoint > 90) {
    return "";
  }
  return String.fromCodePoint(0x1f1e6 - 65 + codePoint);
}

export function getCountryFlag(country) {
  if (typeof country !== "string" || country.trim().length < 2) {
    return "";
  }
  return (
    getRegionalIndicatorSymbol(country[0]) +
    getRegionalIndicatorSymbol(country[1])
  );
}
