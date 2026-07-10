import type { Meta, StoryObj } from "@storybook/react";

import { PrincipleCard } from "./PrincipleCard";

const meta = {
  title: "Molecules/PrincipleCard",
  component: PrincipleCard,
  tags: ["autodocs"],
  render: (args) => (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 320 }}>
      <PrincipleCard {...args} />
    </ol>
  ),
} satisfies Meta<typeof PrincipleCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    index: "01",
    title: "Instant, even on launch",
    description:
      "Perceived performance came first — the feed had to paint fast and feel personal from the very first frame.",
  },
};

export const Orange: Story = {
  args: {
    index: "02",
    tone: "orange",
    title: "One system, many surfaces",
    description:
      "A shared component and data layer kept five surfaces consistent — and cheap to extend.",
  },
};

export const Green: Story = {
  args: {
    index: "03",
    tone: "green",
    title: "Real time, no jank",
    description:
      "Live data streaming constantly, without dropping frames or hammering the network.",
  },
};
