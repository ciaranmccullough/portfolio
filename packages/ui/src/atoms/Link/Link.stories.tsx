import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "./Link";

const meta = {
  title: "Atoms/Link",
  component: Link,
  tags: ["autodocs"],
  args: { href: "https://example.com" },
} satisfies Meta<typeof Link>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Nav: Story = { args: { children: "Work" } };

export const Inline: Story = {
  args: { variant: "inline", children: "github.com/ciaran ↗" },
};
