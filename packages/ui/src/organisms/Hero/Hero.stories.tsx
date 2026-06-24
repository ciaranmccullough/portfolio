import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../atoms";
import { CtaGroup } from "../../molecules";
import { Hero } from "./Hero";

const meta = {
  title: "Organisms/Hero",
  component: Hero,
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: "Available for work",
    title: "Software engineer building polished product UI.",
    intro:
      "I design and ship accessible interfaces with a focus on craft, performance, and a tidy design system.",
    children: (
      <CtaGroup>
        <Button variant="primary">View work ↘</Button>
        <Button variant="ghost">Résumé</Button>
      </CtaGroup>
    ),
  },
};
