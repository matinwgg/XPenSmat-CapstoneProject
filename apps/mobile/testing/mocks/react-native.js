/* Minimal React Native stand-in used by the Jest suite. */
const React = require("react");

const host =
  (name) =>
  ({ children, ...props }) =>
    React.createElement(name, props, children);

const View = host("View");
const Text = host("Text");
const TextInput = host("TextInput");
const TouchableOpacity = host("TouchableOpacity");
const TouchableHighlight = host("TouchableHighlight");
const TouchableWithoutFeedback = host("TouchableWithoutFeedback");
const Pressable = host("Pressable");
const ScrollView = host("ScrollView");
const FlatList = host("FlatList");
const SectionList = host("SectionList");
const Image = host("Image");
const ImageBackground = host("ImageBackground");
const Modal = host("Modal");
const ActivityIndicator = host("ActivityIndicator");
const Button = host("Button");
const Switch = host("Switch");
const RefreshControl = host("RefreshControl");
const KeyboardAvoidingView = host("KeyboardAvoidingView");
const SafeAreaView = host("SafeAreaView");
const StatusBar = host("StatusBar");
const VirtualizedList = host("VirtualizedList");

const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => {
    if (!style) return {};
    if (Array.isArray(style)) return Object.assign({}, ...style.map(StyleSheet.flatten));
    return style;
  },
  compose: (a, b) => [a, b],
  absoluteFill: {},
  absoluteFillObject: {},
  hairlineWidth: 1,
};

const Platform = {
  OS: "android",
  Version: 34,
  select: (spec) => (spec.android !== undefined ? spec.android : spec.default),
};

const Dimensions = {
  get: () => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
  addEventListener: () => ({ remove: () => {} }),
};

const PixelRatio = { get: () => 3, getFontScale: () => 1, roundToNearestPixel: (n) => n };

const Alert = {
  alert: jest.fn(),
};

const ToastAndroid = {
  SHORT: 0,
  LONG: 1,
  show: jest.fn(),
  showWithGravity: jest.fn(),
};

const AlertIOS = { alert: jest.fn() };

const Linking = {
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  addEventListener: () => ({ remove: () => {} }),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
};

const AppState = {
  currentState: "active",
  addEventListener: () => ({ remove: () => {} }),
};

const Animated = {
  Value: class {
    constructor(value) {
      this._value = value;
    }
    setValue(value) {
      this._value = value;
    }
    interpolate() {
      return this;
    }
    addListener() {
      return "1";
    }
    removeListener() {}
  },
  timing: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  spring: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  sequence: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  parallel: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  View,
  Text,
  Image,
  ScrollView,
  createAnimatedComponent: (component) => component,
};

const useColorScheme = () => "light";
const useWindowDimensions = () => Dimensions.get();

module.exports = {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  FlatList,
  SectionList,
  Image,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Button,
  Switch,
  RefreshControl,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  VirtualizedList,
  StyleSheet,
  Platform,
  Dimensions,
  PixelRatio,
  Alert,
  ToastAndroid,
  AlertIOS,
  Linking,
  AppState,
  Animated,
  useColorScheme,
  useWindowDimensions,
};
