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
    children: (
      <>
        <SkillCategory title="Languages">
          <Tag>TypeScript</Tag>
          <Tag>Kotlin</Tag>
        </SkillCategory>
        <SkillCategory title="Frameworks">
          <Tag>React</Tag>
          <Tag>Next.js</Tag>
        </SkillCategory>
        <SkillCategory title="Tooling">
          <Tag>Vite</Tag>
          <Tag>Storybook</Tag>
        </SkillCategory>
      </>
    ),
  },
};
