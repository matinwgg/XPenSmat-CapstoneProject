/** Pure helper modules: flag rendering, chart processing, currency list. */
const React = require("react");
const { getCountryFlag } = require("../partials/flag-icons");
const { processWeeklyData } = require("../partials/queries/ChartQuery");
const { CURRENCIES, getCurrencyItems } = require("../partials/utils");
const { useComponent } = require("../partials/hooks");
const { View } = require("react-native");
const TestRenderer = require("react-test-renderer");

describe("flag-icons", () => {
  test.each([
    ["US", "🇺🇸"],
    ["GH", "🇬🇭"],
    ["gb", "🇬🇧"],
    ["NG", "🇳🇬"],
  ])("renders the regional indicator pair for %s", (code, flag) => {
    expect(getCountryFlag(code)).toBe(flag);
  });

  test("derives a flag from a three-letter currency code", () => {
    expect(getCountryFlag("GHS")).toBe("🇬🇭");
  });

  test("returns an empty string for unusable input", () => {
    expect(getCountryFlag("")).toBe("");
    expect(getCountryFlag("U")).toBe("");
    expect(getCountryFlag(null)).toBe("");
    expect(getCountryFlag(42)).toBe("");
    expect(getCountryFlag("12")).toBe("");
  });
});

describe("ChartQuery.processWeeklyData", () => {
  test("builds seven bars, one per weekday", () => {
    const result = processWeeklyData([]);
    expect(result).toHaveLength(7);
    expect(result.map((bar) => bar.label)).toEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
    result.forEach((bar) => {
      expect(bar.value).toBe(0);
      expect(bar.frontColor).toBe("#d1d5db");
    });
  });

  test("applies income colours to populated days", () => {
    const result = processWeeklyData([{ dayOfWeek: 1, total: 250 }], "Income");
    expect(result[1].value).toBe(250);
    expect(result[1].frontColor).toBe("#d3ff00");
    expect(result[1].gradientColor).toBe("#12ff00");
  });

  test("applies expense colours", () => {
    const result = processWeeklyData([{ dayOfWeek: 3, total: 120 }], "Expense");
    expect(result[3].frontColor).toBe("#ffab00");
    expect(result[3].gradientColor).toBe("#ff0000");
  });

  test("keeps small values grey", () => {
    const result = processWeeklyData([{ dayOfWeek: 2, total: 99 }], "Income");
    expect(result[2].frontColor).toBe("#d1d5db");
  });

  test("ignores out-of-range weekdays", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = processWeeklyData([
      { dayOfWeek: -1, total: 10 },
      { dayOfWeek: 7, total: 10 },
    ]);
    result.forEach((bar) => expect(bar.value).toBe(0));
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test("tolerates a missing data argument", () => {
    expect(processWeeklyData()).toHaveLength(7);
  });
});

describe("currency catalogue", () => {
  test("exposes a large, unique set of ISO codes", () => {
    const codes = Object.keys(CURRENCIES);
    expect(codes.length).toBeGreaterThan(100);
    expect(new Set(codes).size).toBe(codes.length);
    codes.forEach((code) => expect(code).toMatch(/^[A-Z]{3}$/));
  });

  test("includes the currencies used by the app's default locales", () => {
    ["USD", "GHS", "EUR", "GBP", "NGN"].forEach((code) => {
      expect(CURRENCIES[code]).toBeTruthy();
    });
  });

  test("builds dropdown items with labels, values and icon renderers", () => {
    const items = getCurrencyItems();
    expect(items).toHaveLength(Object.keys(CURRENCIES).length);
    const usd = items.find((item) => item.value === "USD");
    expect(usd.label).toBe("United States Dollar");
    const rendered = usd.icon();
    expect(React.isValidElement(rendered)).toBe(true);
    expect(rendered.props.children).toBe("🇺🇸");
  });
});

describe("static reference data", () => {
  const { categoriesIcons } = require("../partials/categoryIcons");
  const { countriesData } = require("../partials/countriesData");
  const { currencyData } = require("../partials/currencyData");

  test("category icons are unique and well formed", () => {
    const entries = categoriesIcons.categoriesWithIcons;
    expect(entries.length).toBeGreaterThan(15);
    const names = entries.map((entry) => entry.category);
    expect(new Set(names).size).toBe(names.length);
    entries.forEach((entry) => {
      expect(typeof entry.category).toBe("string");
      expect(entry.icon).toMatch(/-outline$/);
    });
  });

  test("country picker data uses ISO currency codes", () => {
    const countries = countriesData.countries;
    expect(countries.length).toBeGreaterThan(50);
    countries.forEach((country) => {
      expect(country.code).toMatch(/^[A-Z]{3}$/);
      expect(typeof country.currency).toBe("string");
    });
  });

  test("currency list entries carry a code, symbol and display name", () => {
    const currencies = currencyData.countries;
    expect(currencies.length).toBeGreaterThan(50);
    currencies.forEach((entry) => {
      expect(entry.code).toMatch(/^[A-Z]{3}$/);
      expect(typeof entry.currency).toBe("string");
      expect(typeof entry.currencyName).toBe("string");
      expect(entry.currencyName.length).toBeGreaterThan(0);
    });
  });

  test("partials barrel re-exports the usable components", () => {
    const barrel = require("../partials");
    ["CurrencyDropdown", "DatePicker", "Donut", "DropdownComponent"].forEach(
      (name) => expect(barrel[name]).toBeTruthy()
    );
    expect(barrel.getCountryFlag).toBe(getCountryFlag);
    expect(Array.isArray(barrel.CountryCodeList)).toBe(true);
  });
});

describe("hooks.useComponent", () => {
  test("binds props and forwards render-time props", () => {
    const Bound = useComponent(View, { accessibilityLabel: "wrapper" });
    let tree;
    TestRenderer.act(() => {
      tree = TestRenderer.create(React.createElement(Bound, { testID: "child" }));
    });
    const view = tree.root.findByType(View);
    expect(view.props.accessibilityLabel).toBe("wrapper");
    expect(view.props.testID).toBe("child");
  });

  test("works without a props argument", () => {
    const Bound = useComponent(View);
    expect(typeof Bound).toBe("function");
  });
});
