import type { Meta, StoryObj } from "@storybook/react";

import { FormField } from "./FormField";

const meta = {
  title: "Molecules/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: { label: "Email", defaultValue: "ada@example.com" },
  render: (args) => (
    <div style={{ background: "#17161d", padding: 18, borderRadius: 10 }}>
      <FormField {...args} />
    </div>
  ),
} satisfies Meta<typeof FormField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    defaultValue: "not-an-email",
    error: "Please enter a valid email address.",
  },
};

export const Multiline: Story = {
  args: {
    label: "Enquiry",
    multiline: true,
    defaultValue: "Tell me a little about the project or role…",
  },
};
