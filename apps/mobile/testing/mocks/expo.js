/* Stubs for the Expo SDK surface used by the app. */
const React = require("react");

const stub = (name) => {
  const Component = (props) => React.createElement(name, props, props.children);
  Component.displayName = name;
  return Component;
};

const Stack = Object.assign(stub("Stack"), {
  Screen: stub("Stack.Screen"),
});
const Tabs = Object.assign(stub("Tabs"), {
  Screen: stub("Tabs.Screen"),
});
const Drawer = Object.assign(stub("Drawer"), {
  Screen: stub("Drawer.Screen"),
});

const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

const useRouter = () => router;
const useNavigation = () => ({ navigate: jest.fn(), goBack: jest.fn(), toggleDrawer: jest.fn() });
const useLocalSearchParams = () => ({});
const useSearchParams = () => ({});
const useSegments = () => [];
const usePathname = () => "/";
const useFocusEffect = (callback) => {
  if (typeof callback === "function") callback();
};

const SplashScreen = { preventAutoHideAsync: jest.fn(), hideAsync: jest.fn() };
const Redirect = stub("Redirect");
const Link = stub("Link");
const Slot = stub("Slot");

const useFonts = () => [true, null];
const useAuthRequest = () => [{}, null, jest.fn()];
const makeRedirectUri = () => "xpensmat://redirect";

const WebBrowser = {
  openAuthSessionAsync: jest.fn(() => Promise.resolve({ type: "success" })),
  maybeCompleteAuthSession: jest.fn(),
  dismissBrowser: jest.fn(),
};

const Google = {
  useAuthRequest: () => [{}, null, jest.fn()],
  useIdTokenAuthRequest: () => [{}, null, jest.fn()],
};

const createURL = (path = "") => `xpensmat://${path}`;

module.exports = {
  __esModule: true,
  default: stub("Default"),
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(() => Promise.resolve({ type: "success" })),
  dismissBrowser: jest.fn(),
  Stack,
  Tabs,
  Drawer,
  router,
  useRouter,
  useNavigation,
  useLocalSearchParams,
  useSearchParams,
  useSegments,
  usePathname,
  useFocusEffect,
  SplashScreen,
  Redirect,
  Link,
  Slot,
  useFonts,
  useAuthRequest,
  makeRedirectUri,
  createURL,
};
