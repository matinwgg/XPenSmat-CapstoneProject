const getSymbolFromCurrency = (code) => {
  const symbols = { USD: "$", GHS: "₵", EUR: "€", GBP: "£", NGN: "₦" };
  return symbols[code] || undefined;
};

module.exports = getSymbolFromCurrency;
module.exports.default = getSymbolFromCurrency;
module.exports.__esModule = true;
