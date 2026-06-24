import type { Meta, StoryObj } from "@storybook/react";

import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
} satisfies Meta<typeof Eyebrow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Violet: Story = {
  args: { children: "01 — Selected work" },
};

export const Orange: Story = {
  args: { tone: "orange", children: "02 — Case study" },
};
