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

/** Dark-surface inline link (e.g. the Contact panel's socials). */
export const Social: Story = {
  args: { variant: "social", children: "GitHub ↗" },
  render: (args) => (
    <div style={{ background: "#17161d", padding: 24 }}>
      <Link {...args} />
    </div>
  ),
};
