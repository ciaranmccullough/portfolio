import type { Meta, StoryObj } from "@storybook/react";

import { ScrollProgressBar } from "./ScrollProgressBar";

const meta = {
  title: "Atoms/ScrollProgressBar",
  component: ScrollProgressBar,
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ position: "relative", height: 80 }}>
      <ScrollProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ScrollProgressBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { progress: 0 } };
export const Halfway: Story = { args: { progress: 50 } };
export const Complete: Story = { args: { progress: 100 } };
