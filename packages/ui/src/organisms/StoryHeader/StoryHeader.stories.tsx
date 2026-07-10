import type { Meta, StoryObj } from "@storybook/react";

import { StoryHeader } from "./StoryHeader";

const meta = {
  title: "Organisms/StoryHeader",
  component: StoryHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof StoryHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: "Ciaran",
    brandHref: "/",
    backLabel: "Back to work",
    backHref: "/#work",
  },
};
