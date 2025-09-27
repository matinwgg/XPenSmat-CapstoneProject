function getRegionalIndicatorSymbol(letter){
    return String.fromCodePoint(
      0x1f1e6 - 65 + letter.toUpperCase().charCodeAt(0)
    );
  }
  
  export function getCountryFlag(country) {
    return (
      getRegionalIndicatorSymbol(country[0]) +
      getRegionalIndicatorSymbol(country[1])
    );
  }