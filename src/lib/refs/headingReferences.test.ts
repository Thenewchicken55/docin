import { describe, expect, it } from "vitest";
import {
  createHeadingReference,
  renderHeadingReference,
} from "./headingReferences";

describe("headingReferences", () => {
  describe("createHeadingReference", () => {
    it("creates a heading reference with correct structure", () => {
      const reference = createHeadingReference("intro", "Introduction");
      expect(reference.targetSlug).toBe("intro");
      expect(reference.label).toBe("Introduction");
      expect(reference.id).toContain("intro");
    });

    it("generates unique IDs for each reference", () => {
      const ref1 = createHeadingReference("intro", "Introduction");
      const ref2 = createHeadingReference("intro", "Introduction");
      expect(ref1.id).not.toBe(ref2.id);
    });
  });

  describe("renderHeadingReference", () => {
    it("renders heading reference as markdown link", () => {
      const reference = createHeadingReference("intro", "Introduction");
      const rendered = renderHeadingReference(reference);
      expect(rendered).toBe("[Introduction](#intro)");
    });
  });
});
