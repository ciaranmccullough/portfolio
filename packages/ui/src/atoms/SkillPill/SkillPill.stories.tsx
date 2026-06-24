import type { Meta, StoryObj } from "@storybook/react";

import { SkillPill } from "./SkillPill";

const meta = {
  title: "Atoms/SkillPill",
  component: SkillPill,
  tags: ["autodocs"],
  render: (args) => (
    <ul style={{ display: "flex", gap: 10, listStyle: "none" }}>
      <SkillPill {...args} />
    </ul>
  ),
} satisfies Meta<typeof SkillPill>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Android: Story = {
  args: { tone: "android", children: "Android" },
};
export const ReactNative: Story = {
  args: { tone: "react", children: "React Native" },
};
