/* `lucide-react-native` icon stubs. */
const React = require("react");

const icon = (name) => {
  const Icon = (props) => React.createElement(name, props);
  Icon.displayName = name;
  return Icon;
};

module.exports = {
  __esModule: true,
  default: icon("LucideIcon"),
  Send: icon("Send"),
  Search: icon("Search"),
  X: icon("X"),
  Check: icon("Check"),
};
