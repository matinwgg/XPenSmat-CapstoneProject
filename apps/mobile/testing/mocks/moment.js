/* Minimal `moment` substitute: enough for calendar formatting. */
function moment(value) {
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  return {
    toDate: () => date,
    format: () => date.toISOString(),
    add: () => moment(date),
    subtract: () => moment(date),
    startOf: () => moment(date),
    endOf: () => moment(date),
    clone: () => moment(date),
    isSame: () => true,
    isBefore: () => false,
    isAfter: () => false,
    valueOf: () => date.getTime(),
  };
}

moment.locale = () => "en";
moment.utc = (value) => moment(value);
module.exports = moment;
module.exports.default = moment;
module.exports.__esModule = true;
