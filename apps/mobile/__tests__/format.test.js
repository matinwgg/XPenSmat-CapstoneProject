/** Pure formatting helpers used across the redesigned screens. */
const {
  toNumber,
  formatAmount,
  formatCurrency,
  formatDateLabel,
  formatShortDate,
  sumAmounts,
  countByType,
  groupTransactionsByCategory,
  getInitials,
  getGreeting,
  titleCase,
  getDisplayName,
  splitPhoneNumber,
  digitsOnly,
} = require("../lib/format");

describe("numbers and money", () => {
  test("toNumber tolerates strings and missing values", () => {
    expect(toNumber("12.5")).toBe(12.5);
    expect(toNumber(0)).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber("nope")).toBe(0);
    expect(toNumber(null)).toBe(0);
  });

  test("formatAmount groups thousands and keeps decimals", () => {
    expect(formatAmount(1234567.5)).toBe("1,234,567.50");
    expect(formatAmount("42")).toBe("42.00");
    expect(formatAmount(-9876.543)).toBe("-9,876.54");
    expect(formatAmount(0, 0)).toBe("0");
  });

  test("formatCurrency prefers a symbol, then a currency code", () => {
    expect(formatCurrency(1234.5, { symbol: "$" })).toBe("$1,234.50");
    expect(formatCurrency(1234.5, { currency: "GHS" })).toBe("GHS 1,234.50");
    expect(formatCurrency(4)).toBe("4.00");
  });
});

describe("dates", () => {
  test("formatDateLabel renders a readable date", () => {
    expect(formatDateLabel("2026-11-19T10:00:00Z")).toBe("Thu, 19 Nov 2026");
    expect(formatDateLabel("")).toBe("—");
    expect(formatDateLabel("not-a-date")).toBe("—");
  });

  test("formatShortDate omits the year", () => {
    expect(formatShortDate("2026-11-09")).toBe("9 Nov");
    expect(formatShortDate(null)).toBe("—");
  });
});

describe("transaction aggregation", () => {
  const posts = [
    { type: "Expense", ItemAmount: "10.5", category: "Food" },
    { type: "Expense", ItemAmount: 4.5, category: "Food" },
    { type: "Income", ItemAmount: 100, category: "Salary" },
    { type: "Expense", ItemAmount: "bad", category: "Rent" },
  ];

  test("sumAmounts filters by type and ignores invalid amounts", () => {
    expect(sumAmounts(posts, "Expense")).toBe(15);
    expect(sumAmounts(posts, "Income")).toBe(100);
    expect(sumAmounts(posts)).toBe(115);
    expect(sumAmounts(null, "Expense")).toBe(0);
  });

  test("countByType counts matching rows", () => {
    expect(countByType(posts, "Expense")).toBe(3);
    expect(countByType(posts, "Income")).toBe(1);
    expect(countByType(undefined, "Income")).toBe(0);
  });

  test("groups categories by total, descending", () => {
    const grouped = groupTransactionsByCategory(posts);
    expect(grouped.map((group) => group.category)).toEqual([
      "Salary",
      "Food",
      "Rent",
    ]);
    const food = grouped.find((group) => group.category === "Food");
    expect(food.count).toBe(2);
    expect(food.total).toBe(15);
    expect(food.items).toHaveLength(2);
  });

  test("falls back to an Uncategorised bucket", () => {
    const grouped = groupTransactionsByCategory([{ ItemAmount: 5 }]);
    expect(grouped[0].category).toBe("Uncategorised");
    expect(grouped[0].total).toBe(5);
  });
});

describe("people helpers", () => {
  test("getInitials copes with one, two or no names", () => {
    expect(getInitials("Ada", "Lovelace")).toBe("AL");
    expect(getInitials("Ada")).toBe("AD");
    expect(getInitials("", null, undefined)).toBe("?");
  });

  test("getGreeting changes with the time of day", () => {
    expect(getGreeting(new Date(2026, 0, 1, 7))).toBe("Good morning");
    expect(getGreeting(new Date(2026, 0, 1, 13))).toBe("Good afternoon");
    expect(getGreeting(new Date(2026, 0, 1, 20))).toBe("Good evening");
  });

  test("titleCase only capitalises the first letter", () => {
    expect(titleCase("aDA")).toBe("ADA");
    expect(titleCase("")).toBe("");
    expect(titleCase(undefined)).toBe("");
  });

  test("getDisplayName prefers first name, then username and email", () => {
    expect(getDisplayName({ firstName: "ada" })).toBe("Ada");
    expect(getDisplayName({ username: "grace" })).toBe("Grace");
    expect(getDisplayName({ email: "linus@example.com" })).toBe("linus");
    expect(getDisplayName(null)).toBe("there");
  });

  test("splitPhoneNumber separates known dial codes", () => {
    expect(splitPhoneNumber("+233551234567")).toEqual({
      countryCode: "+233",
      phoneNumber: "551234567",
    });
    expect(splitPhoneNumber("+1 555 123 4567")).toEqual({
      countryCode: "+1",
      phoneNumber: "5551234567",
    });
    expect(splitPhoneNumber("0551234567")).toEqual({
      countryCode: "+233",
      phoneNumber: "0551234567",
    });
    expect(splitPhoneNumber(null)).toEqual({
      countryCode: "+233",
      phoneNumber: "",
    });
  });

  test("digitsOnly strips formatting", () => {
    expect(digitsOnly("+233 (55) 123-4567")).toBe("233551234567");
    expect(digitsOnly(undefined)).toBe("");
  });
});
