import { mapHero } from "@/mappers/heroMapper";
import type { RichTextDocument } from "@/services/contentful/contentful";

/** Build a minimal Rich Text document from a flat list of runs. */
function doc(runs: Array<{ text: string; bold?: boolean }>): RichTextDocument {
  return {
    nodeType: "document",
    content: [
      {
        nodeType: "paragraph",
        content: runs.map((r) => ({
          nodeType: "text",
          value: r.text,
          marks: r.bold ? [{ type: "bold" }] : [],
        })),
      },
    ],
  };
}

describe("mapHero", () => {
  it("passes description and resume through unchanged", () => {
    const hero = mapHero({
      titleRichText: doc([{ text: "Hi" }]),
      description: "Building things",
      resume: "https://example.com/cv.pdf",
    });
    expect(hero.description).toBe("Building things");
    expect(hero.resumeUrl).toBe("https://example.com/cv.pdf");
  });

  it("flattens text runs into title segments, flagging bold runs as highlights", () => {
    const hero = mapHero({
      titleRichText: doc([
        { text: "I build " },
        { text: "delightful", bold: true },
        { text: " software" },
      ]),
      description: "",
      resume: "",
    });
    expect(hero.title).toEqual([
      { text: "I build ", highlight: false },
      { text: "delightful", highlight: true },
      { text: " software", highlight: false },
    ]);
  });

  it("returns a single empty run when the title document is missing", () => {
    const hero = mapHero({
      titleRichText: undefined,
      description: "",
      resume: "",
    });
    expect(hero.title).toEqual([{ text: "", highlight: false }]);
  });

  it("recurses into nested block content to collect deep text runs", () => {
    const nested: RichTextDocument = {
      nodeType: "document",
      content: [
        {
          nodeType: "paragraph",
          content: [
            {
              nodeType: "hyperlink",
              content: [{ nodeType: "text", value: "nested", marks: [] }],
            },
          ],
        },
      ],
    };
    const hero = mapHero({
      titleRichText: nested,
      description: "",
      resume: "",
    });
    expect(hero.title).toEqual([{ text: "nested", highlight: false }]);
  });

  it("skips empty-valued text nodes and collapses to one empty run if all are empty", () => {
    const hero = mapHero({
      titleRichText: doc([{ text: "" }, { text: "" }]),
      description: "",
      resume: "",
    });
    expect(hero.title).toEqual([{ text: "", highlight: false }]);
  });
});
