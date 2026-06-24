import type { Meta, StoryObj } from "@storybook/react";

import { RepoRow } from "../../molecules";
import { OpenSource } from "./OpenSource";

const meta = {
  title: "Organisms/OpenSource",
  component: OpenSource,
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSource>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <RepoRow
          name="ciaran/enterprise-ui"
          href="https://github.com"
          stars="1.2k"
        />
        <RepoRow
          name="ciaran/design-tokens"
          href="https://github.com"
          stars="640"
        />
        <RepoRow name="ciaran/cli-kit" href="https://github.com" stars="312" />
      </>
    ),
  },
};
