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
    eyebrow: "In the open",
    title: "Open source",
    action: <a href="https://github.com/ciaran">github.com/ciaran ↗</a>,
    children: (
      <>
        <RepoRow
          name="ciaran/enterprise-ui"
          href="https://github.com"
          description="A tiny, tree-shakeable component kit"
          lang="TypeScript"
          stars="1.2k"
          tone="violet"
        />
        <RepoRow
          name="ciaran/design-tokens"
          href="https://github.com"
          description="Design tokens as CSS, shipped everywhere"
          lang="CSS"
          stars="640"
          tone="amber"
        />
        <RepoRow
          name="ciaran/cli-kit"
          href="https://github.com"
          description="Ergonomic building blocks for CLIs"
          lang="Go"
          stars="312"
          tone="green"
        />
      </>
    ),
  },
};

/** The panel works without a header, too. */
export const PanelOnly: Story = {
  args: {
    children: (
      <>
        <RepoRow
          name="ciaran/enterprise-ui"
          href="https://github.com"
          stars="1.2k"
        />
        <RepoRow name="ciaran/cli-kit" href="https://github.com" stars="312" />
      </>
    ),
  },
};
