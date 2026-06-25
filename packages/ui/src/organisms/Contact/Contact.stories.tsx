import type { Meta, StoryObj } from "@storybook/react";

import { Contact } from "./Contact";

const meta = {
  title: "Organisms/Contact",
  component: Contact,
  tags: ["autodocs"],
} satisfies Meta<typeof Contact>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "05 — Say hello",
    title: "Let's build something together.",
    intro:
      "Open to frontend web, hybrid mobile, Android and full-stack roles, freelance, and the odd side quest. Replies within a day.",
    socials: [
      { label: "GitHub ↗", href: "#" },
      { label: "LinkedIn ↗", href: "#" },
    ],
    children: (
      <p style={{ color: "#c4c0cf", fontFamily: "monospace" }}>
        {/* The interactive form is composed at the app level and passed here. */}
        Contact form slot
      </p>
    ),
  },
};
