import type { Meta, StoryObj } from "@storybook/react";

import { Tag } from "../../atoms";
import { SkillCategory } from "../../molecules";
import { Toolbox } from "./Toolbox";

const meta = {
  title: "Organisms/Toolbox",
  component: Toolbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Toolbox>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "02 — The toolbox",
    title: "What I reach for",
    children: (
      <>
        <SkillCategory title="Languages" tone="violet">
          <Tag>TypeScript</Tag>
          <Tag>Kotlin</Tag>
          <Tag>JavaScript</Tag>
          <Tag>HTML/CSS</Tag>
        </SkillCategory>
        <SkillCategory title="Frameworks" tone="orange">
          <Tag>React</Tag>
          <Tag>React Native</Tag>
          <Tag>Jetpack Compose</Tag>
          <Tag>Next.js</Tag>
          <Tag>Astro</Tag>
          <Tag>Node.js</Tag>
        </SkillCategory>
        <SkillCategory title="Craft" tone="green">
          <Tag>AI</Tag>
          <Tag>Performance</Tag>
          <Tag>Design System</Tag>
          <Tag>Accessibility</Tag>
          <Tag>Testing</Tag>
        </SkillCategory>
        <SkillCategory title="Tooling" tone="amber">
          <Tag>Git</Tag>
          <Tag>Gradle</Tag>
          <Tag>Claude Code</Tag>
          <Tag>Figma</Tag>
          <Tag>Vite</Tag>
        </SkillCategory>
      </>
    ),
  },
};
