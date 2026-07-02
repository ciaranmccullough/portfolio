import type { Meta, StoryObj } from "@storybook/react";

import { RepoRow } from "./RepoRow";

const meta = {
  title: "Molecules/RepoRow",
  component: RepoRow,
  tags: ["autodocs"],
  render: (args) => (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      <RepoRow {...args} />
    </ul>
  ),
} satisfies Meta<typeof RepoRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "ciaran/enterprise-ui",
    href: "https://github.com/ciaran/enterprise-ui",
    description: "A tiny, tree-shakeable component kit",
    lang: "TypeScript",
    stars: "1.2k",
    tone: "violet",
  },
};

/** Name + stars only — description and language are optional. */
export const NameAndStarsOnly: Story = {
  args: {
    name: "ciaran/cli-kit",
    href: "https://github.com/ciaran/cli-kit",
    stars: "312",
  },
};

/** The dots pick up any brand tone. */
export const AmberTone: Story = {
  args: {
    name: "ciaran/design-tokens",
    href: "https://github.com/ciaran/design-tokens",
    description: "Design tokens as CSS, shipped to every surface",
    lang: "CSS",
    stars: "640",
    tone: "amber",
  },
};
