import type { Meta, StoryObj } from "@storybook/react";

import { About } from "./About";

const meta = {
  title: "Organisms/About",
  component: About,
  tags: ["autodocs"],
} satisfies Meta<typeof About>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "03 — About",
    title: "Curious, collaborative, and relentless about the details.",
    description:
      "I'm a product-focused engineer who cares as much about how a team works as what it ships. I start with the user and the problem before the solution, and I try to leave things better than I found them.",
    sticker: "// hi there 👋",
    portrait: <div className="size-full bg-inset" />,
    tabs: [
      {
        title: "Product mindset",
        description: "I think in products, not tickets",
      },
      {
        title: "Teamwork",
        description: "I get design and engineering speaking one language",
      },
      {
        title: "Determination",
        description: "I push past 'good enough' on the problems others skip",
      },
      {
        title: "Creativity",
        description: "Always experimenting with new tools and ideas",
      },
    ],
  },
};
