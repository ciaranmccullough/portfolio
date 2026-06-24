import type { Meta, StoryObj } from "@storybook/react";

import { Tag } from "../../atoms";
import { SkillCategory } from "./SkillCategory";

const meta = {
  title: "Molecules/SkillCategory",
  component: SkillCategory,
  tags: ["autodocs"],
} satisfies Meta<typeof SkillCategory>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Languages: Story = {
  args: {
    title: "Languages",
    children: (
      <>
        <Tag>TypeScript</Tag>
        <Tag>Kotlin</Tag>
      </>
    ),
  },
};
