import type { Meta, StoryObj } from "@storybook/react";

import { Reflection } from "./Reflection";

const meta = {
  title: "Organisms/Reflection",
  component: Reflection,
  tags: ["autodocs"],
} satisfies Meta<typeof Reflection>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "// Reflection",
    title: "What it taught me",
    reflections: [
      {
        title: "Perceived speed is a feature.",
        description:
          "Caching and optimistic rendering did more for how the app felt than any single screen.",
      },
      {
        title: "Boring infrastructure wins.",
        description:
          "The shared card system was the least glamorous call — and the one that let everything else move fast.",
        accent: true,
      },
      {
        title: "The small stuff is the story.",
        description:
          "A two-second poll reveal is the moment people actually remember.",
      },
    ],
  },
};
