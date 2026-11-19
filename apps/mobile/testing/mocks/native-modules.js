/* Generic stub for third-party React Native widget libraries. */
const React = require("react");

const stubComponent = (displayName) => {
  const Component = (props) => React.createElement(displayName, props, props.children);
  Component.displayName = displayName;
  return Component;
};

const RBSheet = React.forwardRef((props, ref) => {
  if (ref && typeof ref === "object") {
    ref.current = { open: jest.fn(), close: jest.fn() };
  }
  return React.createElement("RBSheet", props, props.children);
});

const SafeAreaView = stubComponent("SafeAreaView");
const FlatList = stubComponent("FlatList");
const SvgXml = stubComponent("SvgXml");
const CalendarStrip = stubComponent("CalendarStrip");
const DropDownPicker = stubComponent("DropDownPicker");
const Dropdown = stubComponent("Dropdown");
const DateTimePickerModal = stubComponent("DateTimePickerModal");
const CountryFlag = stubComponent("CountryFlag");
const CountryPicker = stubComponent("CountryPicker");
const BarChart = stubComponent("BarChart");
const PieChart = stubComponent("PieChart");
const LineChart = stubComponent("LineChart");
const Swiper = stubComponent("Swiper");
const SegmentedControl = stubComponent("SegmentedControl");
const Feather = stubComponent("Feather");
const Ionicons = stubComponent("Ionicons");
const FontAwesome5 = stubComponent("FontAwesome5");
const AntDesign = stubComponent("AntDesign");
const MaterialIcons = stubComponent("MaterialIcons");
const SymbolView = stubComponent("SymbolView");
const BlurView = stubComponent("BlurView");
const GestureHandlerRootView = stubComponent("GestureHandlerRootView");

const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 390, height: 844 });
const SafeAreaProvider = ({ children }) => children;

module.exports = {
  __esModule: true,
  default: stubComponent("Stub"),
  stubComponent,
  RBSheet,
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
  useSafeAreaFrame,
  FlatList,
  SvgXml,
  CalendarStrip,
  DropDownPicker,
  Dropdown,
  DateTimePickerModal,
  CountryFlag,
  CountryPicker,
  BarChart,
  PieChart,
  LineChart,
  Swiper,
  SegmentedControl,
  Feather,
  Ionicons,
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  SymbolView,
  BlurView,
  GestureHandlerRootView,
};
