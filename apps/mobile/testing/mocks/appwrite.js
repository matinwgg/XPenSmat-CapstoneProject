/* Controllable stand-in for the Appwrite SDK. */

const makeClient = () => ({
  setEndpoint: jest.fn(function () {
    return this;
  }),
  setProject: jest.fn(function () {
    return this;
  }),
  setPlatform: jest.fn(function () {
    return this;
  }),
  setLocale: jest.fn(function () {
    return this;
  }),
  subscribe: jest.fn(() => () => {}),
});

class Client {
  constructor() {
    Object.assign(this, makeClient());
  }
}

const account = {
  create: jest.fn(),
  createEmailPasswordSession: jest.fn(),
  createEmailSession: jest.fn(),
  get: jest.fn(),
  getSession: jest.fn(),
  deleteSession: jest.fn(),
  deleteSessions: jest.fn(),
  createVerification: jest.fn(),
  updateVerification: jest.fn(),
  createRecovery: jest.fn(),
  updateRecovery: jest.fn(),
  updateEmail: jest.fn(),
  updateName: jest.fn(),
  updatePassword: jest.fn(),
  createOAuth2Session: jest.fn(),
};

class Account {
  constructor() {
    Object.assign(this, account);
  }
}

const databases = {
  listDocuments: jest.fn(async () => ({ documents: [], total: 0 })),
  getDocument: jest.fn(),
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
};

class Databases {
  constructor() {
    Object.assign(this, databases);
  }
}

const storage = {
  createFile: jest.fn(),
  deleteFile: jest.fn(),
  getFilePreview: jest.fn(),
  getFileView: jest.fn(),
};

class Storage {
  constructor() {
    Object.assign(this, storage);
  }
}

class ID {
  static unique() {
    return "unique-id";
  }

  static custom(value) {
    return value;
  }
}

const avatars = {
  getInitials: jest.fn(() => ({ toString: () => "https://avatars.test/initials" })),
  getFlag: jest.fn(() => ({ toString: () => "https://avatars.test/flag" })),
};

class Avatars {
  constructor() {
    Object.assign(this, avatars);
  }
}

const query = {
  equal: jest.fn((field, value) => `equal:${field}:${JSON.stringify(value)}`),
  notEqual: jest.fn((field, value) => `notEqual:${field}:${JSON.stringify(value)}`),
  greaterThan: jest.fn((field, value) => `greaterThan:${field}:${value}`),
  greaterThanEqual: jest.fn((field, value) => `greaterThanEqual:${field}:${value}`),
  lessThan: jest.fn((field, value) => `lessThan:${field}:${value}`),
  lessThanEqual: jest.fn((field, value) => `lessThanEqual:${field}:${value}`),
  search: jest.fn((field, value) => `search:${field}:${value}`),
  orderDesc: jest.fn((field) => `orderDesc:${field}`),
  orderAsc: jest.fn((field) => `orderAsc:${field}`),
  limit: jest.fn((value) => `limit:${value}`),
  offset: jest.fn((value) => `offset:${value}`),
  select: jest.fn((value) => `select:${JSON.stringify(value)}`),
  between: jest.fn((field, start, end) => `between:${field}:${start}:${end}`),
};

class Query {
  static get equal() {
    return query.equal;
  }
  static get notEqual() {
    return query.notEqual;
  }
  static get greaterThan() {
    return query.greaterThan;
  }
  static get greaterThanEqual() {
    return query.greaterThanEqual;
  }
  static get lessThan() {
    return query.lessThan;
  }
  static get lessThanEqual() {
    return query.lessThanEqual;
  }
  static get search() {
    return query.search;
  }
  static get orderDesc() {
    return query.orderDesc;
  }
  static get orderAsc() {
    return query.orderAsc;
  }
  static get limit() {
    return query.limit;
  }
  static get offset() {
    return query.offset;
  }
  static get select() {
    return query.select;
  }
  static get between() {
    return query.between;
  }
}

const OAuthProvider = {
  Google: "google",
  Github: "github",
};

const Role = {
  user: jest.fn((userId) => `user:${userId}`),
};

const Permission = {
  read: jest.fn((role) => `read:${role}`),
  update: jest.fn((role) => `update:${role}`),
  delete: jest.fn((role) => `delete:${role}`),
};

class AppwriteException extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AppwriteException";
    this.code = code;
  }
}

const reset = () => {
  account.create.mockReset();
  account.createEmailPasswordSession.mockReset();
  account.createEmailSession.mockReset();
  account.get.mockReset();
  account.getSession.mockReset();
  account.deleteSession.mockReset();
  account.deleteSessions.mockReset();
  account.createVerification.mockReset();
  account.updateVerification.mockReset();
  account.createRecovery.mockReset();
  account.updateRecovery.mockReset();
  account.updateEmail.mockReset();
  account.updateName.mockReset();
  account.updatePassword.mockReset();
  account.createOAuth2Session.mockReset();
  databases.listDocuments.mockReset();
  databases.listDocuments.mockResolvedValue({ documents: [], total: 0 });
  databases.getDocument.mockReset();
  databases.createDocument.mockReset();
  databases.updateDocument.mockReset();
  databases.deleteDocument.mockReset();
  storage.createFile.mockReset();
  storage.deleteFile.mockReset();
  avatars.getInitials.mockReset();
  avatars.getInitials.mockReturnValue({ toString: () => "https://avatars.test/initials" });
  Object.values(query).forEach((fn) => fn.mockClear());
  Object.values(Permission).forEach((fn) => fn.mockClear());
  Role.user.mockClear();
};

module.exports = {
  __esModule: true,
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Avatars,
  Query,
  OAuthProvider,
  Role,
  Permission,
  AppwriteException,
  __mocks: { account, databases, storage, avatars, query, reset },
};
