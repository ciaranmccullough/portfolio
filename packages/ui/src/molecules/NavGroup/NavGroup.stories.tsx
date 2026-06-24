import type { Meta, StoryObj } from "@storybook/react";

import { NavGroup } from "./NavGroup";

const meta = {
  title: "Molecules/NavGroup",
  component: NavGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof NavGroup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Primary",
    items: [
      { href: "#work", label: "Work" },
      { href: "#stack", label: "Stack" },
      { href: "#about", label: "About" },
    ],
  },
};
