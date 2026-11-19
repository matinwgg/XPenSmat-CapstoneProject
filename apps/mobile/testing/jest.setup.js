/* Shared Jest setup: silence noisy logs and expose deterministic globals. */
const { __mocks } = require("./mocks/appwrite");

jest.setTimeout(15000);

global.__APPWRITE_MOCKS__ = __mocks;

// React Native modules commonly read these globals.
global.__DEV__ = true;

const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) {
    return;
  }
  originalConsoleError(...args);
};
