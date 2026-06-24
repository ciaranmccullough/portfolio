import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../atoms";
import { CtaGroup } from "./CtaGroup";

const meta = {
  title: "Molecules/CtaGroup",
  component: CtaGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof CtaGroup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Primary actions",
    children: (
      <>
        <Button variant="primary">View work ↘</Button>
        <Button variant="ghost">Résumé</Button>
      </>
    ),
  },
};
