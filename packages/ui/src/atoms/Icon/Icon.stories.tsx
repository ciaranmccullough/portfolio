import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "./Icon";

const gridSvg = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="9" height="9" rx="1.6" />
    <rect x="11" y="11" width="9" height="9" rx="1.6" />
  </svg>
);

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
} satisfies Meta<typeof Icon>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Decorative: Story = { args: { children: gridSvg } };

export const Labelled: Story = {
  args: { label: "Dashboard", children: gridSvg },
};

export const Large: Story = {
  args: { className: "size-10 text-brand-violet", children: gridSvg },
};
