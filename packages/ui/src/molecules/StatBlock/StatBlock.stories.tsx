import type { Meta, StoryObj } from "@storybook/react";

import { StatBlock } from "./StatBlock";

const meta = {
  title: "Molecules/StatBlock",
  component: StatBlock,
  tags: ["autodocs"],
  render: (args) => (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 180 }}>
      <StatBlock {...args} />
    </ul>
  ),
} satisfies Meta<typeof StatBlock>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "5+ yrs", label: "shipping production" },
};
