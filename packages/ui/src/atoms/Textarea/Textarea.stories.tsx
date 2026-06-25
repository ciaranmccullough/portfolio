import type { Meta, StoryObj } from "@storybook/react";

import { Textarea } from "./Textarea";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Message",
    defaultValue: "Tell me a little about the project or role…",
  },
  render: (args) => (
    <div style={{ background: "#17161d", padding: 18, borderRadius: 10 }}>
      <Textarea {...args} />
    </div>
  ),
};
