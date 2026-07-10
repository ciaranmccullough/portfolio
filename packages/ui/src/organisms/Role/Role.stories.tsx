import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../atoms";
import { Role } from "./Role";

const meta = {
  title: "Organisms/Role",
  component: Role,
  tags: ["autodocs"],
} satisfies Meta<typeof Role>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "// The role",
    title: "What I owned across the app",
    description:
      "I worked across the app as an engineer — from the onboarding flow and the modular feed system to the live-scores data layer and the Play voting features — shipping on iOS and Android alongside design and product.",
    children: (
      <>
        <Button pill size="lg">
          View the project ↗
        </Button>
        <Button pill size="lg" variant="ghost-dark">
          ← Back to all work
        </Button>
      </>
    ),
  },
};

/** Without actions, the card still renders cleanly. */
export const NoActions: Story = {
  args: {
    title: "What I owned across the app",
    description: "I worked across the app as an engineer.",
  },
};
