// @portfolio/ui is ESM in node_modules (skipped by next/jest); stub the two
// atoms RichText composes so the renderer's node mapping can be asserted.
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    Text: ({
      as,
      children,
    }: {
      as?: string;
      variant?: string;
      children: React.ReactNode;
    }) => React.createElement(as ?? "p", null, children),
    Link: ({
      children,
      as: _as,
      variant: _variant,
      ...props
    }: Record<string, unknown> & { children: React.ReactNode }) =>
      React.createElement("a", props, children),
  };
});

import { render, screen } from "@testing-library/react";
import type { Document } from "@contentful/rich-text-types";

import { RichText } from "@/app/components/RichText/RichText";

const document = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "heading-2",
      data: {},
      content: [
        { nodeType: "text", value: "Section one", marks: [], data: {} },
      ],
    },
    {
      nodeType: "paragraph",
      data: {},
      content: [
        { nodeType: "text", value: "Plain and ", marks: [], data: {} },
        {
          nodeType: "text",
          value: "bold",
          marks: [{ type: "bold" }],
          data: {},
        },
        { nodeType: "text", value: " with a ", marks: [], data: {} },
        {
          nodeType: "hyperlink",
          data: { uri: "https://example.com" },
          content: [{ nodeType: "text", value: "link", marks: [], data: {} }],
        },
      ],
    },
    {
      nodeType: "unordered-list",
      data: {},
      content: [
        {
          nodeType: "list-item",
          data: {},
          content: [
            {
              nodeType: "paragraph",
              data: {},
              content: [
                { nodeType: "text", value: "First item", marks: [], data: {} },
              ],
            },
          ],
        },
      ],
    },
  ],
} as unknown as Document;

describe("RichText", () => {
  it("renders a heading demoted to <h2>", () => {
    render(<RichText document={document} />);

    const heading = screen.getByRole("heading", { name: "Section one" });
    expect(heading.tagName).toBe("H2");
  });

  it("renders bold marks as <strong>", () => {
    render(<RichText document={document} />);

    const bold = screen.getByText("bold");
    expect(bold.tagName).toBe("STRONG");
  });

  it("renders an absolute hyperlink that opens in a new tab", () => {
    render(<RichText document={document} />);

    const link = screen.getByRole("link", { name: "link" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders list items", () => {
    render(<RichText document={document} />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveTextContent("First item");
  });
});
