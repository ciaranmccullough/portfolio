import type { Meta, StoryObj } from "@storybook/react";

import { Toast } from "./Toast";

const meta = {
  title: "Molecules/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: {
    onDismiss: () => {},
    dismissLabel: "Dismiss",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Toast {...args} />
    </div>
  ),
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    title: "Message sent ✦",
    message: "Thanks — your enquiry just landed in my inbox.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Couldn't send your message",
    message: "Something went wrong. Please try again, or email me directly.",
  },
};

export const TitleOnly: Story = {
  args: { variant: "success", title: "Saved" },
};
