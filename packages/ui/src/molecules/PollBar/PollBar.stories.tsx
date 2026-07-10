import type { Meta, StoryObj } from "@storybook/react";

import { PollBar } from "./PollBar";

const meta = {
  title: "Molecules/PollBar",
  component: PollBar,
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <PollBar {...args} />
    </div>
  ),
} satisfies Meta<typeof PollBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { label: "Bellingham", value: 57, leading: true },
      { label: "Kane", value: 19 },
      { label: "Saka", value: 6 },
    ],
  },
};
