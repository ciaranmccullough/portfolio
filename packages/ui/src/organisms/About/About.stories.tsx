import type { Meta, StoryObj } from "@storybook/react";

import { About } from "./About";

const meta = {
  title: "Organisms/About",
  component: About,
  tags: ["autodocs"],
} satisfies Meta<typeof About>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bio: "I'm a software engineer who cares about craft — accessible interfaces, tidy design systems, and shipping production software that lasts.",
    stats: [
      { value: "5+ yrs", label: "shipping production" },
      { value: "30+", label: "projects delivered" },
      { value: "12", label: "open-source repos" },
    ],
  },
};
