import type { Meta, StoryObj } from "@storybook/react";

import { PhoneMockup } from "./PhoneMockup";

const meta = {
  title: "Molecules/PhoneMockup",
  component: PhoneMockup,
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <PhoneMockup {...args} />
    </div>
  ),
} satisfies Meta<typeof PhoneMockup>;
export default meta;

type Story = StoryObj<typeof meta>;

const steps = [
  { label: "Onboarding" },
  { label: "Home" },
  { label: "Scores" },
  { label: "Play" },
  { label: "News" },
];

export const Default: Story = {
  args: {
    image: (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c4c0cf",
          fontFamily: "monospace",
          fontSize: 12,
        }}
      >
        SCREEN
      </div>
    ),
    steps,
    activeStep: 1,
  },
};

/** A CMS item with a blank image field falls back to the empty screen (or a supplied fallback). */
export const MissingImage: Story = {
  args: {
    fallback: "Preview coming soon",
    steps,
    activeStep: 0,
  },
};

/** With no `steps`, the progress row is omitted entirely. */
export const NoProgressRow: Story = {
  args: {
    fallback: "SCREEN",
  },
};
