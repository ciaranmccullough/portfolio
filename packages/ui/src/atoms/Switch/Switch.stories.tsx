import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from "./Switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { "aria-label": "Toggle setting" },
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Off by default — click to toggle (uncontrolled; the DOM owns the value). */
export const Off: Story = { args: { defaultChecked: false } };

export const On: Story = { args: { defaultChecked: true } };

/** Locked, always-on control — rendered checked + disabled with a lock glyph. */
export const Locked: Story = {
  args: { locked: true, "aria-label": "Strictly necessary" },
};
