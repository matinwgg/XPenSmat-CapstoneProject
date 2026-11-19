/**
 * Module smoke tests.
 *
 * Every screen, component and helper is imported so syntax errors, broken
 * imports (including the classic "../../" mistakes) and missing exports fail
 * the suite. Components are additionally rendered with the shallowest possible
 * props to prove they produce valid React elements.
 */
const React = require("react");
const TestRenderer = require("react-test-renderer");
const { act } = TestRenderer;

jest.mock("../lib/appwrite", () => {
  const actual = jest.requireActual("../testing/mocks/appwrite");
  return new Proxy(
    {},
    {
      get: (target, property) => {
        if (property === "__esModule") return true;
        if (["config", "alterDetails", "recoverPwd"].includes(property)) {
          return {};
        }
        return jest.fn(async () => null);
      },
    }
  );
});

jest.mock("../context/GlobalProvider", () => {
  const context = {
    user: { $id: "user-1" },
    isLoggedIn: true,
    isLoading: false,
    globalCurrency: { symbol: "$" },
    city: "Accra",
    country: "Ghana",
    setIsLoggedIn: jest.fn(),
    setUser: jest.fn(),
    setCurrency: jest.fn(),
    setCity: jest.fn(),
    setCountry: jest.fn(),
    isUserVerified: true,
    setIsUserVerified: jest.fn(),
  };
  return {
    __esModule: true,
    default: ({ children }) => children,
    useGlobalContext: () => context,
  };
});

const modules = {
  "components/index": "../components",
  "components/ActionSheet": "../components/ActionSheet",
  "components/BottomSheet": "../components/BottomSheet",
  "components/CustomAlert": "../components/CustomAlert",
  "components/CustomBottomSheet": "../components/CustomBottomSheet",
  "components/CustomButton": "../components/CustomButton",
  "components/CustomButton2": "../components/CustomButton2",
  "components/CustomCalendar": "../components/CustomCalendar",
  "components/CustomDrawerContent": "../components/CustomDrawerContent",
  "components/CustomInput": "../components/CustomInput",
  "components/CustomText": "../components/CustomText",
  "components/DatePicker": "../components/DatePicker",
  "components/DropdownField": "../components/DropdownField",
  "components/EmptyState": "../components/EmptyState",
  "components/ExpenseAll": "../components/ExpenseAll",
  "components/ExpenseItem": "../components/ExpenseItem",
  "components/FormField": "../components/FormField",
  "components/InputField": "../components/InputField",
  "components/SearchInput": "../components/SearchInput",
  "components/TextField": "../components/TextField",
  "components/Transaction/index": "../components/Transaction",
  "components/Transaction/AddTransaction": "../components/Transaction/AddTransaction",
  "components/Transaction/SummaryChart": "../components/Transaction/SummaryChart",
  "components/Transaction/ui/Card": "../components/Transaction/ui/Card",
  "components/CalendarComponents/index": "../components/CalendarComponents",
  "components/CalendarComponents/app-wrapper": "../components/CalendarComponents/app-wrapper",
  "components/CalendarComponents/task": "../components/CalendarComponents/task",
  "partials/index": "../partials",
  "partials/CustomAlert": "../components/CustomAlert",
  "partials/CurrencyPicker": "../partials/CurrencyPicker",
  "partials/DatePicker": "../partials/DatePicker",
  "partials/Donut": "../partials/Donut",
  "partials/DropdownComponent": "../partials/DropdownComponent",
  "partials/currencydropdownlist": "../partials/currencydropdownlist",
  "partials/share": "../partials/share",
  "partials/toggle-drawer": "../partials/toggle-drawer",
  "partials/store": "../partials/store",
  "partials/queries/ChartQuery": "../partials/queries/ChartQuery",
  "screens/root-layout": "../app/_layout",
  "screens/index": "../app/index",
  "screens/drawer-layout": "../app/(drawer)/_layout",
  "screens/all-expense": "../app/(drawer)/all-expense",
  "screens/currency-converter": "../app/(drawer)/currency-converter",
  "screens/profile": "../app/(drawer)/profile",
  "screens/statistics": "../app/(drawer)/statistics",
  "screens/tabs-layout": "../app/(drawer)/(tabs)/_layout",
  "screens/home-layout": "../app/(drawer)/(tabs)/home/_layout",
  "screens/home": "../app/(drawer)/(tabs)/home/index",
  "screens/seek": "../app/(drawer)/(tabs)/home/seek",
  "screens/add-expense-layout": "../app/(drawer)/(tabs)/add-expense/_layout",
  "screens/add-expense": "../app/(drawer)/(tabs)/add-expense/index",
  "screens/settings-layout": "../app/(drawer)/(tabs)/settings/_layout",
  "screens/settings": "../app/(drawer)/(tabs)/settings/index",
  "screens/settings-contact": "../app/(drawer)/(tabs)/settings/contact-report-terms",
  "screens/settings-currency": "../app/(drawer)/(tabs)/settings/currency",
  "screens/settings-location": "../app/(drawer)/(tabs)/settings/location",
  "screens/settings-profile": "../app/(drawer)/(tabs)/settings/profile",
  "screens/settings-verify-email": "../app/(drawer)/(tabs)/settings/verify-email",
  "screens/auth-layout": "../app/(auth)/_layout",
  "screens/forgot-pwd": "../app/(auth)/forgot-pwd",
  "screens/sign-in": "../app/(auth)/sign-in",
  "screens/sign-up": "../app/(auth)/sign-up",
  "screens/search": "../app/search/[query]",
};

describe("module imports", () => {
  test.each(Object.entries(modules))("%s imports", (name, path) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    expect(() => require(path)).not.toThrow();
  });
});

describe("component exports", () => {
  const callableModules = Object.entries(modules).filter(
    ([name]) =>
      !name.endsWith("index") ||
      name === "components/Transaction/index" ||
      name === "partials/CustomAlert"
  );

  test.each(callableModules)("%s exposes a React component", (name, path) => {
    const module = require(path);
    const exported =
      typeof module === "function"
        ? module
        : module.default ?? Object.values(module)[0];
    expect(exported).toBeTruthy();
    expect(["function", "object"]).toContain(typeof exported);
  });

  test("CustomText exposes all three informational sections", () => {
    const sections = require("../components/CustomText");
    expect(typeof sections.ReportBugContent).toBe("function");
    expect(typeof sections.ContactContent).toBe("function");
    expect(typeof sections.TermsPrivacyContent).toBe("function");
  });

  test.each([
    ["Card", "../components/Transaction/ui/Card", {}],
    ["EmptyState", "../components/EmptyState", { title: "Nothing", subtitle: "Empty" }],
    ["CustomButton", "../components/CustomButton", { title: "Go" }],
    ["CustomButton2", "../components/CustomButton2", { text: "Go" }],
    ["CustomAlert", "../components/CustomAlert", { visible: false }],
    [
      "ExpenseItem",
      "../components/ExpenseItem",
      {
        amount: 12,
        category: "Food",
        item: "Lunch",
        expenseType: "Expense",
        purchaseDate: "2025-01-02T10:00:00Z",
        index: "expense-1",
      },
    ],
    ["Task", "../components/CalendarComponents/task", { item: {} }],
  ])("%s renders without crashing", (name, path, props) => {
    const module = require(path);
    const Component = typeof module === "function" ? module : module.default;
    let tree;
    act(() => {
      tree = TestRenderer.create(React.createElement(Component, props));
    });
    expect(tree.toJSON()).toBeDefined();
  });
});
