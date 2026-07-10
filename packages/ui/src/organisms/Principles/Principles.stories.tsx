import type { Meta, StoryObj } from "@storybook/react";

import { Principles } from "./Principles";

const meta = {
  title: "Organisms/Principles",
  component: Principles,
  tags: ["autodocs"],
} satisfies Meta<typeof Principles>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "// Principles",
    title: "Three ideas held it together",
    principles: [
      {
        title: "Instant, even on launch",
        description:
          "Perceived performance came first — the feed had to paint fast and feel personal from the very first frame.",
      },
      {
        title: "One system, many surfaces",
        description:
          "A shared component and data layer kept five surfaces consistent — and cheap to extend.",
      },
      {
        title: "Real time, no jank",
        description:
          "Live data streaming constantly, without dropping frames or hammering the network.",
      },
    ],
  },
};

/** Real CMS data can drop a description (e.g. a typo'd field id upstream) — the card degrades gracefully. */
export const MissingDescription: Story = {
  args: {
    title: "Three ideas held it together",
    principles: [
      { title: "Instant, even on launch", description: "Performance first." },
      { title: "One system, many surfaces", description: "Shared system." },
      { title: "Real time, optimistic updates" },
    ],
  },
};
