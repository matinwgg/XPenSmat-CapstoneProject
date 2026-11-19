/**
 * Small, pure formatting helpers shared by the screens.
 *
 * Keeping this logic out of the components makes it testable and keeps the
 * rendering code focused on layout. Everything here tolerates the mixed types
 * Appwrite returns (numbers, numeric strings, missing fields).
 */

export const toNumber = (value) => {
  const number = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(number) ? number : 0;
};

/**
 * Format a number with thousands separators and a fixed number of decimals.
 * Implemented without Intl so it behaves the same on every Hermes build.
 */
export const formatAmount = (value, decimals = 2) => {
  const number = toNumber(value);
  const fixed = Math.abs(number).toFixed(decimals);
  const [whole, fraction] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = number < 0 ? "-" : "";
  return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`;
};

/**
 * Format a value as money. `symbol` wins over `currency` so callers can use
 * either the user's selected symbol ("$") or a currency code ("GHS").
 */
export const formatCurrency = (
  value,
  { symbol = "", currency = "", decimals = 2 } = {}
) => {
  const amount = formatAmount(value, decimals);
  if (symbol) return `${symbol}${amount}`;
  if (currency) return `${currency} ${amount}`;
  return amount;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseDate = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (!value) return null;

  const text = String(value).split("T")[0];
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

  // Parse date-only strings in local time. `new Date("2026-11-19")` is UTC
  // midnight, which can display as the previous day in western timezones.
  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3])
      )
    : new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
};

/** "Thu, 19 Nov 2026" (or an em dash when the date is missing/invalid). */
export const formatDateLabel = (value) => {
  const date = parseDate(value);
  if (!date) return "—";
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

/** Short, list-friendly date: "19 Nov". */
export const formatShortDate = (value) => {
  const date = parseDate(value);
  if (!date) return "—";
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

export const sumAmounts = (items, type) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    if (type && item?.type !== type) return total;
    return total + toNumber(item?.ItemAmount ?? item?.amount);
  }, 0);
};

export const countByType = (items, type) => {
  if (!Array.isArray(items)) return 0;
  return items.filter((item) => item?.type === type).length;
};

/**
 * Group transactions by category, newest categories first by total value.
 * Returns an array rather than an object so the order is stable in the UI.
 */
export const groupTransactionsByCategory = (items) => {
  if (!Array.isArray(items)) return [];

  const groups = new Map();
  items.forEach((item) => {
    const category = item?.category || "Uncategorised";
    if (!groups.has(category)) {
      groups.set(category, { category, items: [], total: 0, count: 0 });
    }
    const group = groups.get(category);
    group.items.push(item);
    group.total += toNumber(item?.ItemAmount ?? item?.amount);
    group.count += 1;
  });

  return Array.from(groups.values()).sort((a, b) => b.total - a.total);
};

/** Initials for the avatar fallback ("Ada Lovelace" -> "AL"). */
export const getInitials = (...parts) => {
  const words = parts
    .flat()
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

export const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

/** Capitalise the first letter of a user-entered name without lowercasing it. */
export const titleCase = (value = "") => {
  if (typeof value !== "string" || value.length === 0) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/** Display name for the home header and drawer. */
export const getDisplayName = (user) => {
  if (!user) return "there";
  if (user.firstName) return titleCase(user.firstName);
  if (user.username) return titleCase(user.username);
  if (user.email) return user.email.split("@")[0];
  return "there";
};

// Dial codes the profile screen can recognise when splitting a stored phone
// number back into a country code and a local number. Longest match wins.
const DIAL_CODES = [
  "+971", "+966", "+254", "+255", "+256", "+250", "+251", "+237", "+225",
  "+221", "+260", "+263", "+267", "+268", "+264", "+244", "+245", "+232",
  "+231", "+228", "+227", "+226", "+223", "+220", "+229", "+230", "+261",
  "+262", "+269", "+291", "+234", "+233", "+27", "+44", "+49", "+33",
  "+39", "+34", "+55", "+61", "+86", "+81", "+91", "+1",
];

/**
 * Split a stored phone number into the dial code and the local number so the
 * edit form can show them in separate fields. Falls back to keeping the digits
 * with the supplied default code when the input is ambiguous.
 */
export const splitPhoneNumber = (raw, defaultCode = "+233") => {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { countryCode: defaultCode, phoneNumber: "" };
  }

  const cleaned = raw.replace(/[\s()-]/g, "");

  if (!cleaned.startsWith("+")) {
    return {
      countryCode: defaultCode,
      phoneNumber: cleaned.replace(/\D/g, ""),
    };
  }

  const known = DIAL_CODES.find(
    (code) => cleaned.startsWith(code) && cleaned.length - code.length >= 5
  );

  if (known) {
    return {
      countryCode: known,
      phoneNumber: cleaned.slice(known.length).replace(/\D/g, ""),
    };
  }

  const fallback = /^(\+\d{1,3})(\d{5,})$/.exec(cleaned);
  if (fallback) {
    return { countryCode: fallback[1], phoneNumber: fallback[2] };
  }

  return { countryCode: defaultCode, phoneNumber: cleaned.replace(/\D/g, "") };
};

/** Digits only, used when validating and saving phone numbers. */
export const digitsOnly = (value = "") => String(value).replace(/\D/g, "");
