/** Behavioural tests for the alert and summary chart components. */
const React = require("react");
const TestRenderer = require("react-test-renderer");
const { act } = TestRenderer;
const { Text, TouchableOpacity } = require("react-native");

jest.mock("../lib/appwrite", () => ({
  StatsData: jest.fn(),
}));

jest.mock("../context/GlobalProvider", () => ({
  useGlobalContext: () => ({
    user: { $id: "user-1" },
    globalCurrency: { symbol: "$", currency: "USD" },
  }),
}));

const { StatsData } = require("../lib/appwrite");
const CustomAlert = require("../components/CustomAlert").default;
const SummaryChart = require("../components/Transaction/SummaryChart").default;

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const textContent = (tree) =>
  tree.root
    .findAllByType(Text)
    .map((node) => node.props.children)
    .flat(Infinity)
    .filter((value) => typeof value === "string" || typeof value === "number")
    .join("");

describe("CustomAlert", () => {
  test("renders the message when visible", () => {
    let tree;
    act(() => {
      tree = TestRenderer.create(
        React.createElement(CustomAlert, { visible: true, msg: "Saved!", msg2: "All good" })
      );
    });
    expect(textContent(tree)).toContain("Saved!");
    expect(textContent(tree)).toContain("All good");
    const modal = tree.root.findByType("Modal");
    expect(modal.props.visible).toBe(true);
  });

  test("stays hidden when not visible", () => {
    let tree;
    act(() => {
      tree = TestRenderer.create(
        React.createElement(CustomAlert, { visible: false, msg: "Hidden" })
      );
    });
    expect(tree.root.findByType("Modal").props.visible).toBe(false);
  });

  test("invokes onClose when OK is pressed", () => {
    const onClose = jest.fn();
    let tree;
    act(() => {
      tree = TestRenderer.create(
        React.createElement(CustomAlert, { visible: true, msg: "Done", onClose })
      );
    });
    const button = tree.root.findAllByType(TouchableOpacity)[0];
    act(() => {
      button.props.onPress();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(tree.root.findByType("Modal").props.visible).toBe(false);
  });

  test("closes itself when the back button is pressed", () => {
    let tree;
    act(() => {
      tree = TestRenderer.create(
        React.createElement(CustomAlert, { visible: true, msg: "Done" })
      );
    });
    act(() => {
      tree.root.findByType("Modal").props.onRequestClose();
    });
    expect(tree.root.findByType("Modal").props.visible).toBe(false);
  });

  test("reacts to later visibility changes", () => {
    let tree;
    act(() => {
      tree = TestRenderer.create(React.createElement(CustomAlert, { visible: false }));
    });
    act(() => {
      tree.update(React.createElement(CustomAlert, { visible: true }));
    });
    expect(tree.root.findByType("Modal").props.visible).toBe(true);
  });
});

describe("SummaryChart", () => {
  const isoDate = (date) => date.toISOString();

  beforeEach(() => {
    StatsData.mockReset();
  });

  test("renders a zero total before data arrives", async () => {
    StatsData.mockResolvedValue({ documents: [] });
    let tree;
    await act(async () => {
      tree = TestRenderer.create(React.createElement(SummaryChart));
    });
    await flush();
    expect(textContent(tree)).toContain("Total Income");
    expect(textContent(tree)).toContain("$0.00");
  });

  test("sums the current week's income", async () => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    const midweek = new Date(start);
    midweek.setDate(start.getDate() + 2);

    StatsData.mockResolvedValue({
      documents: [
        { type: "Income", dateofpurchase: isoDate(midweek), ItemAmount: "120.50" },
        { type: "Income", dateofpurchase: isoDate(start), ItemAmount: 79.5 },
        { type: "Expense", dateofpurchase: isoDate(start), ItemAmount: 10 },
      ],
    });

    let tree;
    await act(async () => {
      tree = TestRenderer.create(React.createElement(SummaryChart));
    });
    await flush();

    expect(textContent(tree)).toContain("$200.00");
    const chart = tree.root.findByType("BarChart");
    expect(chart.props.data).toHaveLength(7);
    expect(chart.props.data.reduce((sum, bar) => sum + bar.value, 0)).toBe(200);
  });

  test("switches to expenses using the segmented control", async () => {
    StatsData.mockResolvedValue({
      documents: [
        { type: "Expense", dateofpurchase: isoDate(new Date()), ItemAmount: 42 },
        { type: "Income", dateofpurchase: isoDate(new Date()), ItemAmount: 100 },
      ],
    });

    let tree;
    await act(async () => {
      tree = TestRenderer.create(React.createElement(SummaryChart));
    });
    await flush();
    expect(textContent(tree)).toContain("Total Income");

    const segmented = tree.root
      .findAllByType("Stub")
      .find((node) => Array.isArray(node.props.values) && node.props.values.length === 2);
    await act(async () => {
      segmented.props.onChange({ nativeEvent: { selectedSegmentIndex: 1 } });
    });
    await flush();

    expect(textContent(tree)).toContain("Total Spending");
    expect(textContent(tree)).toContain("$42.00");
  });

  test("ignores transactions outside the current week", async () => {
    const old = new Date(2020, 0, 1);
    StatsData.mockResolvedValue({
      documents: [{ type: "Income", dateofpurchase: isoDate(old), ItemAmount: 500 }],
    });

    let tree;
    await act(async () => {
      tree = TestRenderer.create(React.createElement(SummaryChart));
    });
    await flush();
    expect(textContent(tree)).toContain("$0.00");
  });

  test("previous/next week buttons refetch the data", async () => {
    StatsData.mockResolvedValue({ documents: [] });
    let tree;
    await act(async () => {
      tree = TestRenderer.create(React.createElement(SummaryChart));
    });
    await flush();
    expect(StatsData).toHaveBeenCalledTimes(1);

    const buttons = tree.root.findAllByType(TouchableOpacity);
    await act(async () => {
      buttons[0].props.onPress();
    });
    await flush();
    expect(StatsData).toHaveBeenCalledTimes(2);

    await act(async () => {
      buttons[1].props.onPress();
    });
    await flush();
    expect(StatsData).toHaveBeenCalledTimes(3);
  });
});
