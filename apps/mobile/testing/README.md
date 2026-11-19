# Mobile test harness

Jest is installed **inside this folder** instead of the app root so the Expo
dependency tree does not have to be installed to run the tests.

```powershell
cd apps/mobile
npm --prefix testing ci  # install the isolated test dependencies once
npm test
```

## Layout

| Path | Purpose |
| --- | --- |
| `jest.config.js` | Roots the suite at `apps/mobile/__tests__`, maps native/Expo modules to stubs. |
| `babel.config.js` | JSX + modern JS transform used by `babel-jest`. |
| `mocks/` | React Native, Expo, Appwrite, AsyncStorage and asset stand-ins. |
| `../__tests__/` | The actual suites. |

## What is covered

- `constants.test.js` — theme, colours, onboarding copy, category metadata, asset maps.
- `lib-appwrite.test.js` — every function in `lib/appwrite.js` (auth, expenses, month ranges, profile updates, password recovery, OAuth).
- `partials.test.js` — country flags, weekly chart processing, currency catalogue, `useComponent`.
- `store.test.js` — Zustand/Immer task store and AsyncStorage persistence.
- `hooks.test.jsx` — `useAppwrite` (both call styles), `GlobalProvider`, `toast`.
- `components.test.jsx` — `CustomAlert` interaction, `SummaryChart` totals/switching.
- `smoke.test.jsx` — imports every screen, layout and component and renders the simple ones.

Mocks are intentionally shallow: they assert the contract the app depends on
(query strings, argument order, returned values) without requiring native code.
