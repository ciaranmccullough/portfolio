import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Switch } from "./Switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { checked: false, "aria-label": "Toggle setting" },
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = { args: { checked: false } };
export const On: Story = { args: { checked: true } };

/** Locked, always-on control — reads as checked and shows a lock glyph. */
export const Locked: Story = {
  args: { checked: true, locked: true, "aria-label": "Strictly necessary" },
};

/** Interactive — click to toggle the controlled value. */
export const Interactive: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onCheckedChange={setOn} />;
  },
};
