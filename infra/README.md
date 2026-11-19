# Appwrite backend

The Appwrite CLI configuration is in the repository root and mirrored in
`apps/mobile/appwrite.config.json` so commands work from either folder.
It targets the existing Frankfurt project, database, user collection, expense
collection, and private file bucket used by the mobile client.

## Apply the schema

Install and log in to the [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation), then run from the repository root:

```sh
appwrite push collections
appwrite push buckets
```

The configured database ID must already exist in the project. Review the
Appwrite CLI changes before confirming them, especially when applying this
manifest to a project that already contains data.

## Run the API in Docker

From the repository root, build and start the API with:

```sh
docker compose -f infra/docker-compose.yml up --build
```

The API is bound to `127.0.0.1:8080`. SQLite data, reports, and trained model
artifacts use separate named volumes. Set `APPWRITE_ENDPOINT` and
`APPWRITE_PROJECT` in the shell or a Compose `.env` file only if the Python
adapters are later implemented; no Appwrite API key is needed by the current
placeholder adapters.

## Data and access model

- `Users` stores the app profile, keyed by the Appwrite account ID.
- `Expenses` stores item, description, category, amount, type, purchase date,
  payment mode, and the profile document ID in `creator`.
- The client grants each created profile and expense document read, update,
  and delete access only to its owning Appwrite account. Authenticated users
  can create documents; collection reads are not public.
- The storage bucket is private and allows authenticated uploads. File access
  must be granted per file by the uploading client.
- Query indexes cover account lookup, creator/date/type filtering, and category
  search.

The Python package's Appwrite auth, function, and sync adapters remain stubs;
the `APPWRITE_ENDPOINT` and `APPWRITE_PROJECT` settings identify the same
project but do not enable server-side SDK calls yet. Never put an Appwrite API
key in the mobile app or commit one to this repository.
