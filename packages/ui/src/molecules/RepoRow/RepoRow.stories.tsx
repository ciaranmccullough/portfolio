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
    stars: "1.2k",
  },
};
