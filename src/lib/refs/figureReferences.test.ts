import { describe, expect, it } from "vitest";
import {
  createFigureReference,
  renderFigureReference,
} from "./figureReferences";

describe("figureReferences", () => {
  describe("createFigureReference", () => {
    it("creates a figure reference with correct structure", () => {
      const reference = createFigureReference(1, "Figure 1");
      expect(reference.figureNumber).toBe(1);
      expect(reference.label).toBe("Figure 1");
      expect(reference.id).toContain("figure-1");
    });

    it("generates unique IDs for each reference", () => {
      const ref1 = createFigureReference(1, "Figure 1");
      const ref2 = createFigureReference(1, "Figure 1");
      expect(ref1.id).not.toBe(ref2.id);
    });
  });

  describe("renderFigureReference", () => {
    it("renders figure reference as markdown link", () => {
      const reference = createFigureReference(1, "Figure 1");
      const rendered = renderFigureReference(reference);
      expect(rendered).toBe("[Figure 1](#figure-1)");
    });
  });
});
