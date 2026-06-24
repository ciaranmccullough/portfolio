import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "./Text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: { variant: "display", children: "Aa Bricolage" },
};

export const Heading: Story = {
  args: { variant: "h2", children: "Section heading" },
};

export const Body: Story = {
  args: {
    variant: "body",
    children:
      "Hanken Grotesk body copy sits at a 1.6 line-height for comfortable reading.",
  },
};
