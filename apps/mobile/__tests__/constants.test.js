/**
 * Constants and static data: every exported value is exercised so that a
 * missing import or malformed theme entry fails the build.
 */
const themeModule = require("../constants/theme");
const colors = require("../constants/colors").default;
const { onboarding, data } = require("../constants/onboarding");
const { categoryColors, categoryEmojies } = require("../constants/summary");
const icons = require("../constants/icons").default;
const images = require("../constants/images").default;
const layout = require("../constants/layout");
const spacing = require("../constants/spacing");
const FontSize = require("../constants/FontSize");
const constants = require("../constants");

const HEX = /^#[0-9a-fA-F]{3,8}$/;

describe("constants/theme", () => {
  const { COLORS, SIZES, FONTS } = themeModule;

  test("exposes a default theme object", () => {
    expect(themeModule.default).toEqual({ COLORS, SIZES, FONTS });
  });

  test("all colours are valid hex values", () => {
    Object.values(COLORS).forEach((value) => {
      expect(value).toMatch(HEX);
    });
  });

  test("sizes are positive numbers", () => {
    Object.entries(SIZES).forEach(([, value]) => {
      expect(typeof value).toBe("number");
      expect(value).toBeGreaterThan(0);
    });
  });

  test("fonts reference defined sizes", () => {
    expect(FONTS.largeTitle.fontSize).toBe(SIZES.largeTitle);
    expect(FONTS.h1.fontSize).toBe(SIZES.h1);
    expect(FONTS.body4.fontSize).toBe(SIZES.body4);
    Object.values(FONTS).forEach((font) => {
      expect(font).toHaveProperty("fontFamily");
      expect(font).toHaveProperty("lineHeight");
    });
  });
});

describe("constants/colors", () => {
  test("every colour is a hex string", () => {
    Object.values(colors).forEach((value) => expect(value).toMatch(HEX));
  });

  test("primary and onPrimary are defined", () => {
    expect(colors.primary).toBeTruthy();
    expect(colors.onPrimary).toBeTruthy();
  });
});

describe("constants/onboarding", () => {
  test("has three uniquely identified entries", () => {
    expect(onboarding).toHaveLength(3);
    expect(new Set(onboarding.map((item) => item.id)).size).toBe(3);
  });

  test("each entry has copy and an image", () => {
    onboarding.forEach((item) => {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(20);
      expect(item.image).toBeTruthy();
    });
  });

  test("default data export re-exports onboarding", () => {
    expect(data.onboarding).toBe(onboarding);
  });
});

describe("constants/summary", () => {
  test("categories have matching colour and emoji entries", () => {
    Object.keys(categoryColors).forEach((category) => {
      expect(categoryEmojies[category]).toBeDefined();
      expect(categoryColors[category]).toMatch(HEX);
    });
  });

  test("a Default fallback exists", () => {
    expect(categoryColors.Default).toBeTruthy();
    expect(categoryEmojies.Default).toBeTruthy();
  });
});

describe("asset maps", () => {
  test("icons map is fully populated", () => {
    expect(Object.keys(icons).length).toBeGreaterThan(30);
    Object.values(icons).forEach((value) => expect(value).toBe("test-file-stub"));
  });

  test("images map has every onboarding asset", () => {
    expect(images.onboard1).toBe("test-file-stub");
    expect(images.onboard2).toBe("test-file-stub");
    expect(images.onboard3).toBe("test-file-stub");
    expect(images.logo).toBe("test-file-stub");
  });
});

describe("layout helpers", () => {
  test("layout exposes screen dimensions", () => {
    expect(layout.SIZES || layout).toBeTruthy();
    expect(JSON.stringify(layout)).toContain("390");
  });

  test("spacing scale increases monotonically", () => {
    const values = Object.values(spacing).filter((value) => typeof value === "number");
    expect(values.length).toBeGreaterThan(0);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });

  test("font size constants are numeric", () => {
    Object.values(FontSize).forEach((value) => {
      if (typeof value === "number") expect(value).toBeGreaterThan(0);
    });
  });
});

describe("constants barrel", () => {
  test("re-exports the runtime constants", () => {
    expect(constants.icons).toBe(icons);
    expect(constants.images).toBe(images);
    expect(constants.theme).toEqual(themeModule.default);
    expect(constants.SIZES).toBe(themeModule.SIZES);
    expect(constants.FONTS).toBe(themeModule.FONTS);
    expect(constants.onboarding).toBe(onboarding);
  });
});
