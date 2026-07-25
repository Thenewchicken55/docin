import { describe, expect, it } from "vitest";
import { createImageEntry, renderImageEntry } from "./imageSupport";

describe("imageSupport", () => {
  describe("createImageEntry", () => {
    it("creates an image entry with automatic figure numbering", () => {
      const entry = createImageEntry("/assets/example.png", "System architecture");
      expect(entry.src).toBe("/assets/example.png");
      expect(entry.alt).toBe("System architecture");
      expect(entry.caption).toContain("System architecture");
      expect(typeof entry.figureNumber).toBe("number");
    });

    it("increments figure number for subsequent images", () => {
      const entry1 = createImageEntry("/assets/first.png", "First image");
      const entry2 = createImageEntry("/assets/second.png", "Second image");
      expect(entry2.figureNumber).toBeGreaterThan(entry1.figureNumber);
    });
  });

  describe("renderImageEntry", () => {
    it("renders image entry as markdown with caption", () => {
      const entry = createImageEntry("/assets/example.png", "System architecture");
      const rendered = renderImageEntry(entry);
      expect(rendered).toContain("![System architecture](/assets/example.png)");
      expect(rendered).toContain("*Figure");
      expect(rendered).toContain("System architecture*");
    });
  });
});
