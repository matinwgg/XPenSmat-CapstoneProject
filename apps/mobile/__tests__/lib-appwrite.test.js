/**
 * Tests for the Appwrite data-access layer (`lib/appwrite.js`).
 *
 * The SDK is replaced by a controllable mock; these tests assert the exact
 * collection/query contract the app relies on.
 */
const sdk = require("react-native-appwrite");

const {
  config,
  createUser,
  verifyEmail,
  getAccount,
  signIn,
  getCurrentUser,
  checkSession,
  signOut,
  getAllPosts,
  getPostsStats,
  getMonthRange,
  getExpStats,
  getPostsSummary,
  getRecentPosts,
  upLoadExpense,
  deleteExpense,
  getDocumentId,
  alterDetails,
  searchPosts,
  StatsData,
  recoverPwd,
  SignInWithGoogle,
  SignInWithGitHub,
} = require("../lib/appwrite");

const { account, databases, avatars } = sdk.__mocks;

beforeEach(() => {
  sdk.__mocks.reset();
});

describe("configuration", () => {
  test("exports the Appwrite identifiers", () => {
    expect(config.endpoint).toMatch(/^https:\/\//);
    expect(config.projectId).toBeTruthy();
    expect(config.databaseId).toBeTruthy();
    expect(config.userCollectionId).toBeTruthy();
    expect(config.expenseCollectionId).toBeTruthy();
  });
});

describe("createUser", () => {
  test("creates an account and a matching profile document", async () => {
    account.create.mockResolvedValue({ $id: "acc-1" });
    account.createEmailPasswordSession.mockResolvedValue({ $id: "session-1" });
    databases.createDocument.mockResolvedValue({ $id: "user-1" });

    const result = await createUser("a@b.com", "secret123", "Jane");

    expect(account.create).toHaveBeenCalledWith(
      "unique-id",
      "a@b.com",
      "secret123",
      "Jane"
    );
    expect(account.createEmailPasswordSession).toHaveBeenCalledWith(
      "a@b.com",
      "secret123"
    );
    expect(avatars.getInitials).toHaveBeenCalledWith("Jane");
    expect(databases.createDocument).toHaveBeenCalledWith(
      config.databaseId,
      config.userCollectionId,
      "unique-id",
      expect.objectContaining({
        accountId: "acc-1",
        email: "a@b.com",
        username: "Jane",
      }),
      [
        "read:user:acc-1",
        "update:user:acc-1",
        "delete:user:acc-1",
      ]
    );
    expect(result).toEqual({ $id: "user-1" });
  });

  test("throws a useful error when the SDK rejects", async () => {
    account.create.mockRejectedValue(new Error("email already exists"));
    await expect(createUser("a@b.com", "secret123", "Jane")).rejects.toThrow("email already exists");
  });
});

describe("verifyEmail", () => {
  test("uses a redirect URL supplied by the caller", async () => {
    account.createVerification.mockResolvedValue({});
    await expect(verifyEmail("https://example.com/verify")).resolves.toBe(true);
    expect(account.createVerification).toHaveBeenCalledWith(
      "https://example.com/verify"
    );
  });

  test("falls back to the default verification URL for legacy email callers", async () => {
    account.createVerification.mockResolvedValue({});
    await expect(verifyEmail("user@example.com")).resolves.toBe(true);
    expect(account.createVerification).toHaveBeenCalledWith(
      expect.stringMatching(/\/verify$/)
    );
  });

  test("returns false when the request fails", async () => {
    account.createVerification.mockRejectedValue(new Error("network"));
    await expect(verifyEmail("https://example.com/verify")).resolves.toBe(false);
  });
});

describe("session helpers", () => {
  test("getAccount returns the active account", async () => {
    account.get.mockResolvedValue({ $id: "acc-1" });
    await expect(getAccount()).resolves.toEqual({ $id: "acc-1" });
  });

  test("getAccount returns null on failure", async () => {
    account.get.mockRejectedValue(new Error("unauthorised"));
    await expect(getAccount()).resolves.toBeNull();
  });

  test("signIn creates an email/password session", async () => {
    account.createEmailPasswordSession.mockResolvedValue({ $id: "session" });
    await expect(signIn("a@b.com", "pw")).resolves.toEqual({ $id: "session" });
    expect(account.createEmailPasswordSession).toHaveBeenCalledWith("a@b.com", "pw");
  });

  test("signIn returns null on failure", async () => {
    account.createEmailPasswordSession.mockRejectedValue(new Error("bad credentials"));
    await expect(signIn("a@b.com", "pw")).rejects.toThrow("bad credentials");
  });

  test("checkSession reports whether a session exists", async () => {
    account.getSession.mockResolvedValue({});
    await expect(checkSession()).resolves.toBe(true);

    account.getSession.mockRejectedValue(new Error("none"));
    await expect(checkSession()).resolves.toBe(false);
  });

  test("signOut deletes the current session", async () => {
    account.deleteSession.mockResolvedValue({ ok: true });
    await expect(signOut()).resolves.toEqual({ ok: true });
    expect(account.deleteSession).toHaveBeenCalledWith("current");
  });

  test("signOut returns null on failure", async () => {
    account.deleteSession.mockRejectedValue(new Error("no session"));
    await expect(signOut()).resolves.toBeNull();
  });
});

describe("getCurrentUser", () => {
  test("returns the profile document for the active account", async () => {
    account.get.mockResolvedValue({ $id: "acc-1" });
    databases.listDocuments.mockResolvedValue({ documents: [{ $id: "user-1" }] });

    await expect(getCurrentUser()).resolves.toEqual({ $id: "user-1" });
    expect(databases.listDocuments).toHaveBeenCalledWith(
      config.databaseId,
      config.userCollectionId,
      ['equal:accountId:"acc-1"']
    );
  });

  test("returns null when no profile document exists", async () => {
    account.get.mockResolvedValue({ $id: "acc-1" });
    databases.listDocuments.mockResolvedValue({ documents: [] });
    await expect(getCurrentUser()).resolves.toBeNull();
  });

  test("returns null when the account lookup fails", async () => {
    account.get.mockRejectedValue(new Error("offline"));
    await expect(getCurrentUser()).resolves.toBeNull();
  });
});

describe("expense queries", () => {
  test("getAllPosts filters by creator", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [{ $id: "e1" }] });
    await expect(getAllPosts("user-1")).resolves.toEqual([{ $id: "e1" }]);
    expect(databases.listDocuments).toHaveBeenCalledWith(
      config.databaseId,
      config.expenseCollectionId,
      ["equal:creator:[\"user-1\"]"]
    );
  });

  test("getAllPosts returns an empty array on failure", async () => {
    databases.listDocuments.mockRejectedValue(new Error("boom"));
    await expect(getAllPosts("user-1")).resolves.toEqual([]);
  });

  test("getPostsStats orders by date and limits to 30", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [] });
    await getPostsStats("user-1");
    const queries = databases.listDocuments.mock.calls[0][2];
    expect(queries).toEqual([
      'equal:creator:["user-1"]',
      "orderDesc:dateofpurchase",
      "limit:30",
    ]);
  });

  test("getRecentPosts orders by creation date and limits to 7", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [] });
    await getRecentPosts("user-1");
    const queries = databases.listDocuments.mock.calls[0][2];
    expect(queries).toEqual([
      'equal:creator:["user-1"]',
      "orderDesc:$createdAt",
      "limit:7",
    ]);
  });

  test("getPostsSummary filters by range and type", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [] });
    await getPostsSummary("user-1", "2025-01-01", "2025-01-31", "Expense");
    expect(databases.listDocuments).toHaveBeenCalledWith(
      config.databaseId,
      config.expenseCollectionId,
      [
        'equal:creator:["user-1"]',
        "greaterThanEqual:dateofpurchase:2025-01-01",
        "lessThanEqual:dateofpurchase:2025-01-31",
        'equal:type:"Expense"',
      ]
    );
  });

  test("upLoadExpense writes the expected document payload", async () => {
    account.get.mockResolvedValue({ $id: "acc-1" });
    databases.createDocument.mockResolvedValue({ $id: "expense-1" });
    const result = await upLoadExpense(
      "Lunch",
      "Team lunch",
      "Food",
      25.5,
      "Expense",
      "2025-02-01",
      "Cash",
      "user-1"
    );
    expect(result).toEqual({ $id: "expense-1" });
    expect(databases.createDocument).toHaveBeenCalledWith(
      config.databaseId,
      config.expenseCollectionId,
      "unique-id",
      {
        item: "Lunch",
        description: "Team lunch",
        category: "Food",
        ItemAmount: 25.5,
        type: "Expense",
        dateofpurchase: "2025-02-01",
        modeOfPayment: "Cash",
        creator: "user-1",
      },
      [
        "read:user:acc-1",
        "update:user:acc-1",
        "delete:user:acc-1",
      ]
    );
  });

  test("upLoadExpense returns null on failure", async () => {
    databases.createDocument.mockRejectedValue(new Error("quota"));
    await expect(
      upLoadExpense("a", "b", "c", 1, "Expense", "d", "e", "f")
    ).resolves.toBeNull();
  });

  test("deleteExpense removes the document", async () => {
    databases.deleteDocument.mockResolvedValue({});
    await expect(deleteExpense("expense-1")).resolves.toEqual({});
    expect(databases.deleteDocument).toHaveBeenCalledWith(
      config.databaseId,
      config.expenseCollectionId,
      "expense-1"
    );
  });

  test("deleteExpense returns null on failure", async () => {
    databases.deleteDocument.mockRejectedValue(new Error("missing"));
    await expect(deleteExpense("nope")).resolves.toBeNull();
  });

  test("searchPosts searches the category attribute", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [{ $id: "e1" }] });
    await expect(searchPosts("food")).resolves.toEqual([{ $id: "e1" }]);
    expect(databases.listDocuments).toHaveBeenCalledWith(
      config.databaseId,
      config.expenseCollectionId,
      ["search:category:food"]
    );
  });

  test("searchPosts rethrows a real Error", async () => {
    databases.listDocuments.mockRejectedValue(new Error("boom"));
    await expect(searchPosts("food")).rejects.toThrow("boom");
  });

  test("StatsData returns the raw list response", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [], total: 0 });
    await expect(StatsData("user-1")).resolves.toEqual({ documents: [], total: 0 });
  });

  test("StatsData swallows failures", async () => {
    databases.listDocuments.mockRejectedValue(new Error("boom"));
    await expect(StatsData("user-1")).resolves.toBeUndefined();
  });
});

describe("month helpers", () => {
  test("getMonthRange covers the whole reference month", () => {
    const reference = new Date(2025, 0, 15, 12, 30);
    const { start, end } = getMonthRange(reference);
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(0);
    expect(start.getDate()).toBe(1);
    expect(start.getHours()).toBe(0);
    expect(end.getMonth()).toBe(0);
    expect(end.getDate()).toBe(31);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
    expect(end.getMilliseconds()).toBe(999);
  });

  test("getMonthRange handles December rollover", () => {
    const { start, end } = getMonthRange(new Date(2024, 11, 31));
    expect(start.getMonth()).toBe(11);
    expect(end.getMonth()).toBe(11);
    expect(end.getDate()).toBe(31);
  });

  test("getExpStats sends inclusive ISO boundaries", async () => {
    databases.listDocuments.mockResolvedValue({ documents: [] });
    const reference = new Date(2025, 4, 10);
    await getExpStats("user-1", reference);
    const queries = databases.listDocuments.mock.calls[0][2];
    expect(queries[0]).toBe('equal:creator:["user-1"]');
    expect(queries[1]).toBe(`greaterThanEqual:dateofpurchase:${new Date(2025, 4, 1).toISOString()}`);
    expect(queries[2]).toBe(
      `lessThanEqual:dateofpurchase:${new Date(2025, 4, 31, 23, 59, 59, 999).toISOString()}`
    );
  });

  test("getExpStats returns an empty array on failure", async () => {
    databases.listDocuments.mockRejectedValue(new Error("boom"));
    await expect(getExpStats("user-1")).resolves.toEqual([]);
  });
});

describe("user document helpers", () => {
  test("getDocumentId returns the profile document id", async () => {
    account.get.mockResolvedValue({ $id: "acc-1" });
    databases.listDocuments.mockResolvedValue({ documents: [{ $id: "doc-1" }] });
    await expect(getDocumentId()).resolves.toBe("doc-1");
  });

  test("getDocumentId returns null when no profile exists", async () => {
    account.get.mockResolvedValue({ $id: "acc-1" });
    databases.listDocuments.mockResolvedValue({ documents: [] });
    await expect(getDocumentId()).resolves.toBeNull();
  });

  test("getDocumentId returns null on failure", async () => {
    account.get.mockRejectedValue(new Error("offline"));
    await expect(getDocumentId()).resolves.toBeNull();
  });

  test.each([
    ["setFName", "Jane", { firstName: "Jane" }],
    ["setLName", "Doe", { lastName: "Doe" }],
    ["setPhone", "+123", { phone: "+123" }],
    ["setCity", "Accra", { city: "Accra" }],
    ["setCountry", "Ghana", { country: "Ghana" }],
    ["setCurrency", "GHS", { currency: "GHS" }],
  ])("%s updates the profile document", async (method, value, expected) => {
    databases.updateDocument.mockResolvedValue({ $id: "doc-1" });
    await alterDetails[method]("doc-1", value);
    expect(databases.updateDocument).toHaveBeenCalledWith(
      config.databaseId,
      config.userCollectionId,
      "doc-1",
      expected
    );
  });

  test("alterDetails rejects a missing document id", async () => {
    await expect(alterDetails.setFName(null, "Jane")).rejects.toThrow(
      "Missing SetFname documentId"
    );
    await expect(alterDetails.setLName(undefined, "Doe")).rejects.toThrow(
      "setLan"
    );
    await expect(alterDetails.setPhone("", "1")).rejects.toThrow("setPhone");
    await expect(alterDetails.setCity("", "x")).rejects.toThrow("setCity");
    await expect(alterDetails.setCountry("", "x")).rejects.toThrow("setCountry");
    await expect(alterDetails.setCurrency("", "x")).rejects.toThrow("setCurrency");
  });
});

describe("recoverPwd", () => {
  test("isUserVerified reflects the emailVerification flag", async () => {
    account.get.mockResolvedValue({ emailVerification: true });
    await expect(recoverPwd.isUserVerified()).resolves.toBe(true);
    account.get.mockResolvedValue({ emailVerification: false });
    await expect(recoverPwd.isUserVerified()).resolves.toBe(false);
  });

  test("isUserVerified returns false on error", async () => {
    account.get.mockRejectedValue(new Error("offline"));
    await expect(recoverPwd.isUserVerified()).resolves.toBe(false);
  });

  test("SendEmail triggers verification", async () => {
    account.createVerification.mockResolvedValue({});
    await expect(recoverPwd.SendEmail()).resolves.toBe(true);
  });

  test("SendEmail returns false on error", async () => {
    account.createVerification.mockRejectedValue(new Error("boom"));
    await expect(recoverPwd.SendEmail()).resolves.toBe(false);
  });

  test("recovery sends a reset email", async () => {
    account.createRecovery.mockResolvedValue({});
    await expect(recoverPwd.recovery("a@b.com")).resolves.toBe(true);
    expect(account.createRecovery).toHaveBeenCalledWith(
      "a@b.com",
      expect.stringContaining("/recovery")
    );
  });

  test("recovery returns false on error", async () => {
    account.createRecovery.mockRejectedValue(new Error("boom"));
    await expect(recoverPwd.recovery("a@b.com")).resolves.toBe(false);
  });

  test("updatePassword completes the recovery", async () => {
    account.updateRecovery.mockResolvedValue({ ok: true });
    await expect(
      recoverPwd.updatePassword("user", "secret", "password1", "password1")
    ).resolves.toEqual({ ok: true });
  });

  test("updatePassword rejects short or mismatched passwords", async () => {
    account.updateRecovery.mockClear();
    await expect(
      recoverPwd.updatePassword("user", "secret", "pw", "pw")
    ).rejects.toThrow(/at least 8/);
    await expect(
      recoverPwd.updatePassword("user", "secret", "password1", "password2")
    ).rejects.toThrow(/do not match/);
    expect(account.updateRecovery).not.toHaveBeenCalled();
  });

  test("verifyEmail helper returns the current session", async () => {
    account.getSession.mockResolvedValue({ $id: "s" });
    await expect(recoverPwd.verifyEmail("current")).resolves.toEqual({ $id: "s" });
  });
});

describe("OAuth helpers", () => {
  test("SignInWithGoogle starts a Google session", async () => {
    account.createOAuth2Session.mockReturnValue(undefined);
    await expect(SignInWithGoogle()).resolves.toBe(true);
    const args = account.createOAuth2Session.mock.calls[0];
    expect(args[0]).toBe("google");
    expect(args[1]).toContain("sign-in-with-google");
    expect(args[2]).toContain("oauth-failure");
    expect(args[3]).toEqual(["profile", "email"]);
  });

  test("SignInWithGitHub starts a GitHub session", async () => {
    await expect(SignInWithGitHub()).resolves.toBe(true);
    const args = account.createOAuth2Session.mock.calls[0];
    expect(args[0]).toBe("github");
    expect(args[3]).toEqual(["repo", "user"]);
  });

  test("OAuth helpers report failure instead of throwing", async () => {
    account.createOAuth2Session.mockImplementation(() => {
      throw new Error("popup blocked");
    });
    await expect(SignInWithGoogle()).resolves.toBe(false);
    await expect(SignInWithGitHub()).resolves.toBe(false);
  });
});
