import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Primary" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Dark: Story = { args: { variant: "dark", children: "Dark" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };
export const Large: Story = { args: { size: "lg", children: "Large" } };
