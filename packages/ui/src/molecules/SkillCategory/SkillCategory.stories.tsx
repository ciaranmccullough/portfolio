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
    tone: "violet",
    children: (
      <>
        <Tag>TypeScript</Tag>
        <Tag>Kotlin</Tag>
      </>
    ),
  },
};

export const Frameworks: Story = {
  args: {
    title: "Frameworks",
    tone: "orange",
    children: (
      <>
        <Tag>React</Tag>
        <Tag>Next.js</Tag>
      </>
    ),
  },
};

export const Craft: Story = {
  args: {
    title: "Craft",
    tone: "green",
    children: (
      <>
        <Tag>Performance</Tag>
        <Tag>Accessibility</Tag>
      </>
    ),
  },
};

export const Tooling: Story = {
  args: {
    title: "Tooling",
    tone: "amber",
    children: (
      <>
        <Tag>Git</Tag>
        <Tag>Figma</Tag>
      </>
    ),
  },
};
