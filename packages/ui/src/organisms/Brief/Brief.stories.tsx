import type { Meta, StoryObj } from "@storybook/react";

import { Brief } from "./Brief";

const meta = {
  title: "Organisms/Brief",
  component: Brief,
  tags: ["autodocs"],
} satisfies Meta<typeof Brief>;
export default meta;

type Story = StoryObj<typeof meta>;

/** `body` typically renders the app's Contentful Rich Text output — here a plain paragraph with an inline bold mark, matching the real CMS shape. */
export const Default: Story = {
  args: {
    eyebrow: "// The brief",
    body: (
      <p>
        A <strong>purpose built</strong> experience that brings fans closer to
        the sport they love, pulling scores, news and the group chat into one
        living feed.
      </p>
    ),
  },
};

/** The design mockup's four-line staggered statement is one valid shape for `body` — Brief itself is agnostic to how many blocks are passed. */
export const MultiLineStatement: Story = {
  args: {
    eyebrow: "// The brief",
    body: (
      <>
        <p>Fans live matchday across a dozen tabs —</p>
        <p>scores here, news there, the group chat everywhere.</p>
        <p>
          Pull it into <strong>one living feed</strong>
        </p>
        <p>that feels personal from the very first launch.</p>
      </>
    ),
  },
};
