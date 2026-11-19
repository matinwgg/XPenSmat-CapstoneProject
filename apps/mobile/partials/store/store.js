import { create } from 'zustand';
import { produce } from 'immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Turn the set method into an immer proxy
const immer = (config) => (set, get, api) =>
  config(
    (fn) => {
      const state = typeof fn === 'function' ? fn : () => fn;
      set(produce(state));
    },
    get,
    api
  );

const zustandCreateStore = (children) => create(immer(children));

const STORAGE_KEY = 'TODO';

const storeStates = {
  todo: [],
};

async function persist(todo) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todo));
  } catch (error) {
    // Storage failures must not leave the UI in an inconsistent state.
  }
}

const storeMethods = (set, get) => ({
  init: async () => {
    try {
      const todo = await AsyncStorage.getItem(STORAGE_KEY);
      if (todo !== null) {
        const parsed = JSON.parse(todo);
        if (Array.isArray(parsed)) {
          set({ todo: parsed });
        }
      }
    } catch (error) {
      // Ignore malformed persisted data and start empty.
      set({ todo: [] });
    }
  },
  updateTodo: async (item) => {
    const todo = get().todo;
    const datePresent = todo.find((data) => data.date === item.date);

    const newTodo = datePresent
      ? todo.map((data) =>
          data.date === item.date
            ? { ...data, todoList: [...data.todoList, ...item.todoList] }
            : data
        )
      : [...todo, item];

    set({ todo: newTodo });
    await persist(newTodo);
  },
  deleteTodo: async () => {
    set({ todo: [] });
    await persist([]);
  },
  updateSelectedTask: async (item) => {
    const newTodo = get().todo.map((data) => {
      if (item.date !== data.date) {
        return data;
      }
      const newTodoList = data.todoList.map((list) =>
        list.key === item.todo.key ? item.todo : list
      );
      return { ...data, todoList: newTodoList };
    });
    set({ todo: newTodo });
    await persist(newTodo);
  },
  deleteSelectedTask: async (item) => {
    const newTodo = get()
      .todo.map((data) => {
        if (item.date !== data.date) {
          return data;
        }
        return {
          ...data,
          todoList: data.todoList.filter((list) => list.key !== item.todo.key),
        };
      })
      .filter((data) => data.todoList.length > 0);
    set({ todo: newTodo });
    await persist(newTodo);
  },
});

const useStore = zustandCreateStore((set, get) => ({
  ...storeStates,
  ...storeMethods(set, get),
}));

export default useStore;
