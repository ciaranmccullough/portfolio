import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "./Icon";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "grid" },
} satisfies Meta<typeof Icon>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = { args: { name: "grid" } };
export const Orbit: Story = { args: { name: "orbit" } };
export const Menu: Story = { args: { name: "menu" } };
export const Labelled: Story = {
  args: { name: "arrowUpRight", title: "External link" },
};
