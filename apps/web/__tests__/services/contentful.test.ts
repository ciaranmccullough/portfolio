/**
 * @jest-environment node
 *
 * Service-layer helper: `findRichTextDocument` locates the Rich Text body among
 * an entry's fields without needing to know the field's ID.
 */
import { findRichTextDocument } from "@/services/contentful/contentful";

describe("findRichTextDocument", () => {
  it("returns the first field whose value is a Rich Text document", () => {
    const document = { nodeType: "document", data: {}, content: [] };
    const fields = { title: "Terms of Service", body: document };

    expect(findRichTextDocument(fields)).toBe(document);
  });

  it("returns null when no field is a Rich Text document", () => {
    expect(
      findRichTextDocument({ title: "x", order: 3, live: true }),
    ).toBeNull();
  });

  it("ignores non-document objects (e.g. a nested rich-text node)", () => {
    expect(
      findRichTextDocument({ misc: { nodeType: "paragraph" } }),
    ).toBeNull();
  });

  it("tolerates null field values", () => {
    expect(findRichTextDocument({ body: null, other: undefined })).toBeNull();
  });
});
