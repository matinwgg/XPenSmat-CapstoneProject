/** Zustand + Immer task store backed by AsyncStorage. */
const AsyncStorage = require("@react-native-async-storage/async-storage");
const useStore = require("../partials/store/store").default;

const KEY = "TODO";

beforeEach(async () => {
  await AsyncStorage.clear();
  useStore.setState({ todo: [] });
});

const item = (date, tasks) => ({ date, todoList: tasks });
const task = (key, text) => ({ key, text });

describe("persistence", () => {
  test("init loads a persisted array", async () => {
    const stored = [item("2025-01-01", [task("a", "Pay rent")])];
    await AsyncStorage.setItem(KEY, JSON.stringify(stored));
    await useStore.getState().init();
    expect(useStore.getState().todo).toEqual(stored);
  });

  test("init ignores corrupt JSON and starts empty", async () => {
    await AsyncStorage.setItem(KEY, "{not json");
    await useStore.getState().init();
    expect(useStore.getState().todo).toEqual([]);
  });

  test("init ignores non-array payloads", async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify({ wrong: true }));
    await useStore.getState().init();
    expect(useStore.getState().todo).toEqual([]);
  });
});

describe("updateTodo", () => {
  test("adds a new dated group and persists it", async () => {
    await useStore.getState().updateTodo(item("2025-01-01", [task("a", "Rent")]));
    expect(useStore.getState().todo).toEqual([item("2025-01-01", [task("a", "Rent")])]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      KEY,
      JSON.stringify([item("2025-01-01", [task("a", "Rent")])])
    );
  });

  test("appends tasks to an existing date", async () => {
    await useStore.getState().updateTodo(item("2025-01-01", [task("a", "Rent")]));
    await useStore.getState().updateTodo(item("2025-01-01", [task("b", "Food")]));
    expect(useStore.getState().todo).toHaveLength(1);
    expect(useStore.getState().todo[0].todoList).toEqual([
      task("a", "Rent"),
      task("b", "Food"),
    ]);
  });
});

describe("updateSelectedTask", () => {
  test("replaces the matching task by key", async () => {
    useStore.setState({ todo: [item("2025-01-01", [task("a", "Rent")])] });
    await useStore.getState().updateSelectedTask({
      date: "2025-01-01",
      todo: task("a", "Rent paid"),
    });
    expect(useStore.getState().todo[0].todoList[0].text).toBe("Rent paid");
  });

  test("leaves other dates untouched", async () => {
    useStore.setState({
      todo: [
        item("2025-01-01", [task("a", "Rent")]),
        item("2025-01-02", [task("b", "Food")]),
      ],
    });
    await useStore.getState().updateSelectedTask({
      date: "2025-01-02",
      todo: task("b", "Groceries"),
    });
    expect(useStore.getState().todo[0].todoList[0].text).toBe("Rent");
    expect(useStore.getState().todo[1].todoList[0].text).toBe("Groceries");
  });
});

describe("deleteSelectedTask", () => {
  test("removes a task and drops empty date groups", async () => {
    useStore.setState({ todo: [item("2025-01-01", [task("a", "Rent")])] });
    await useStore.getState().deleteSelectedTask({
      date: "2025-01-01",
      todo: task("a", "Rent"),
    });
    expect(useStore.getState().todo).toEqual([]);
  });

  test("keeps a date group that still has tasks", async () => {
    useStore.setState({
      todo: [item("2025-01-01", [task("a", "Rent"), task("b", "Food")])],
    });
    await useStore.getState().deleteSelectedTask({
      date: "2025-01-01",
      todo: task("a", "Rent"),
    });
    expect(useStore.getState().todo[0].todoList).toEqual([task("b", "Food")]);
  });
});

describe("deleteTodo", () => {
  test("clears everything and persists an empty array", async () => {
    useStore.setState({ todo: [item("2025-01-01", [task("a", "Rent")])] });
    await useStore.getState().deleteTodo();
    expect(useStore.getState().todo).toEqual([]);
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(KEY, "[]");
  });
});

describe("storage failures", () => {
  test("do not reject the action", async () => {
    AsyncStorage.setItem.mockRejectedValueOnce(new Error("quota exceeded"));
    await expect(
      useStore.getState().updateTodo(item("2025-01-01", [task("a", "Rent")]))
    ).resolves.toBeUndefined();
    expect(useStore.getState().todo).toHaveLength(1);
  });
});
