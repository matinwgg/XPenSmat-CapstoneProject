/** React hooks and providers: useAppwrite, GlobalProvider and toast. */
const React = require("react");
const TestRenderer = require("react-test-renderer");
const { act } = TestRenderer;

jest.mock("../lib/appwrite", () => ({
  getCurrentUser: jest.fn(),
}));

const { getCurrentUser } = require("../lib/appwrite");
const useAppwrite = require("../lib/useAppwrite").default;
const GlobalProvider = require("../context/GlobalProvider").default;
const { useGlobalContext } = require("../context/GlobalProvider");
const { toast } = require("../lib/toast");
const { Platform, ToastAndroid, AlertIOS } = require("react-native");

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe("useAppwrite", () => {
  let latest;

  function Probe({ fn }) {
    latest = useAppwrite(fn);
    return null;
  }

  test("loads data from a function argument", async () => {
    await act(async () => {
      TestRenderer.create(
        React.createElement(Probe, { fn: async () => [{ $id: "1" }] })
      );
    });
    await flush();

    expect(latest.isLoading).toBe(false);
    expect(latest.data).toEqual([{ $id: "1" }]);
  });

  test("accepts the object argument style used by SummaryChart", async () => {
    let calls = 0;
    const fn = async () => {
      calls += 1;
      return "payload";
    };

    await act(async () => {
      TestRenderer.create(React.createElement(Probe, { fn: { fn } }));
    });
    await flush();

    expect(calls).toBe(1);
    expect(latest.data).toBe("payload");
    expect(latest.isLoading).toBe(false);
  });

  test("normalises undefined results to an empty array", async () => {
    await act(async () => {
      TestRenderer.create(React.createElement(Probe, { fn: async () => undefined }));
    });
    await flush();
    expect(latest.data).toEqual([]);
  });

  test("reports errors and resets data", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    await act(async () => {
      TestRenderer.create(
        React.createElement(Probe, {
          fn: async () => {
            throw new Error("boom");
          },
        })
      );
    });
    await flush();
    expect(latest.data).toEqual([]);
    expect(latest.isLoading).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("rejects a non-function argument without throwing", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    await act(async () => {
      TestRenderer.create(React.createElement(Probe, { fn: 42 }));
    });
    await flush();
    expect(latest.data).toEqual([]);
    expect(latest.isLoading).toBe(false);
    spy.mockRestore();
  });

  test("refetch runs the query again", async () => {
    const fn = jest.fn(async () => "value");
    await act(async () => {
      TestRenderer.create(React.createElement(Probe, { fn }));
    });
    await flush();
    expect(fn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await latest.refetch();
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("GlobalProvider", () => {
  let captured;

  function Consumer() {
    captured = useGlobalContext();
    return null;
  }

  beforeEach(() => {
    getCurrentUser.mockReset();
    captured = undefined;
  });

  const renderProvider = async () => {
    await act(async () => {
      TestRenderer.create(
        React.createElement(
          GlobalProvider,
          null,
          React.createElement(Consumer)
        )
      );
    });
    await flush();
  };

  test("exposes the signed-in user", async () => {
    getCurrentUser.mockResolvedValue({ $id: "user-1", username: "Jane" });
    await renderProvider();

    expect(captured.user).toEqual({ $id: "user-1", username: "Jane" });
    expect(captured.isLoggedIn).toBe(true);
    expect(captured.isLoading).toBe(false);
  });

  test("treats a missing user as signed out", async () => {
    getCurrentUser.mockResolvedValue(null);
    await renderProvider();
    expect(captured.isLoggedIn).toBe(false);
    expect(captured.user).toBeNull();
    expect(captured.isLoading).toBe(false);
  });

  test("survives a rejected user lookup", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    getCurrentUser.mockRejectedValue(new Error("offline"));
    await renderProvider();
    expect(captured.isLoading).toBe(false);
    expect(captured.isLoggedIn).toBe(false);
    spy.mockRestore();
  });

  test("provides setters and default settings", async () => {
    getCurrentUser.mockResolvedValue(null);
    await renderProvider();

    expect(captured.city).toBe("city");
    expect(captured.country).toBe("country");
    expect(captured.globalCurrency).toEqual({
      name: "currency",
      symbol: "",
      currency: "GHS",
    });
    expect(typeof captured.setIsLoggedIn).toBe("function");
    expect(typeof captured.setCurrency).toBe("function");
    expect(typeof captured.setIsUserVerified).toBe("function");
  });
});

describe("toast", () => {
  beforeEach(() => {
    ToastAndroid.show.mockClear();
    AlertIOS.alert.mockClear();
  });

  afterEach(() => {
    Platform.OS = "android";
  });

  test("uses ToastAndroid on Android", () => {
    Platform.OS = "android";
    toast("Title", "Saved");
    expect(ToastAndroid.show).toHaveBeenCalledWith("Saved", ToastAndroid.SHORT);
    expect(AlertIOS.alert).not.toHaveBeenCalled();
  });

  test("uses AlertIOS on iOS", () => {
    Platform.OS = "ios";
    toast("Title", "Saved");
    expect(AlertIOS.alert).toHaveBeenCalledWith("Title", "Saved");
    expect(ToastAndroid.show).not.toHaveBeenCalled();
  });
});
