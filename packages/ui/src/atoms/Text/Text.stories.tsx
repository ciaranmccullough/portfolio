import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "./Text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

export const Empty: Story = {
  args: {
    children: "",
  },
};
