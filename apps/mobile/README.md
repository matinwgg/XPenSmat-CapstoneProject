# XPenSmat mobile app

Expo Router client for XPenSmat. Route screens live in `app/`; reusable UI
lives in `components/`; Appwrite and application services live in `lib/`.
Native Android project files are kept under `android/`.

## Local development

From this directory:

```sh
npm ci
npm start
```

To install the isolated Jest harness and run the mobile tests:

```sh
npm --prefix testing ci
npm test
```

The root [project README](../../README.md) documents the Python services and
whole-repository workflows. Appwrite identifiers and owner-scoped permissions
are configured in `lib/appwrite.js`; the CLI schema is in `appwrite.config.json`.
