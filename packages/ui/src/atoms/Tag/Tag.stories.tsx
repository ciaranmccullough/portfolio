import type { Meta, StoryObj } from "@storybook/react";

import { Tag } from "./Tag";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  tags: ["autodocs"],
  render: (args) => (
    <ul style={{ display: "flex", gap: 7, listStyle: "none" }}>
      <Tag {...args} />
    </ul>
  ),
} satisfies Meta<typeof Tag>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "TypeScript" } };
