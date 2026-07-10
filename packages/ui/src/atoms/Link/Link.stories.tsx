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

/**
 * Button-styled pill mode — reuses Button's own visual grammar instead of a
 * text-link `variant`. Used for the Story page's Role/Close card CTAs, which
 * the design renders as two large pills, not text links.
 */
export const ButtonPill: Story = {
  args: { buttonVariant: "primary", buttonSize: "lg", children: "Let's talk" },
};

/** The pill mode's secondary tone, as used on a dark surface (e.g. the Role card). */
export const ButtonPillGhostDark: Story = {
  args: {
    buttonVariant: "ghost-dark",
    buttonSize: "lg",
    children: "← Back to all work",
  },
  render: (args) => (
    <div style={{ background: "#17161d", padding: 24 }}>
      <Link {...args} />
    </div>
  ),
};
