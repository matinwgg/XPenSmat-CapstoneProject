const path = require("path");

const mocks = (name) => `<rootDir>/testing/mocks/${name}`;

module.exports = {
  rootDir: "..",
  roots: ["<rootDir>/__tests__"],
  testEnvironment: "node",
  testMatch: ["**/*.test.js", "**/*.test.jsx"],
  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      { configFile: path.join(__dirname, "babel.config.js") },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules", "<rootDir>/testing/node_modules"],
  moduleNameMapper: {
    // Asset imports resolve to a stable placeholder string.
    "\\.(png|jpe?g|gif|webp|svg|ttf|otf|mp4)$": mocks("file-stub.js"),

    // Appwrite must win over the generic `react-native-*` pattern below.
    "^react-native-appwrite$": mocks("appwrite.js"),
    "^appwrite$": mocks("appwrite.js"),

    "^react-native$": mocks("react-native.js"),
    "^react-native/(.*)$": mocks("react-native.js"),
    "^react-native-vector-icons/(.*)$": mocks("native-modules.js"),
    "^@expo/vector-icons(/.*)?$": mocks("native-modules.js"),
    "^@react-navigation/.*$": mocks("native-modules.js"),
    "^@react-native-async-storage/async-storage$": mocks("async-storage.js"),
    "^@react-native-segmented-control/segmented-control$": mocks("native-modules.js"),
    "^@react-native-community/.*$": mocks("native-modules.js"),
    "^@react-native-picker/.*$": mocks("native-modules.js"),
    "^expo-.*$": mocks("expo.js"),
    "^react-native-.*$": mocks("native-modules.js"),
    "^currency-symbol-map$": mocks("currency-symbol-map.js"),
    "^lucide-react-native$": mocks("lucide.js"),
    "^moment$": mocks("moment.js"),
  },
  setupFiles: ["<rootDir>/testing/jest.setup.js"],
  clearMocks: false,
  verbose: false,
};
