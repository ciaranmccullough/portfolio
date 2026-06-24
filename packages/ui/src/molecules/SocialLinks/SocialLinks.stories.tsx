import type { Meta, StoryObj } from "@storybook/react";

import { SocialLinks } from "./SocialLinks";

const meta = {
  title: "Molecules/SocialLinks",
  component: SocialLinks,
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ background: "#17161d", padding: 22, borderRadius: 10 }}>
      <SocialLinks {...args} />
    </div>
  ),
} satisfies Meta<typeof SocialLinks>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { href: "https://github.com", label: "GitHub ↗" },
      { href: "https://linkedin.com", label: "LinkedIn ↗" },
    ],
  },
};
