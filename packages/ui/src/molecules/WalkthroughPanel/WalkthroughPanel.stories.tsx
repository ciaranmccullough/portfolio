import type { Meta, StoryObj } from "@storybook/react";

import { WalkthroughPanel } from "./WalkthroughPanel";

const meta = {
  title: "Molecules/WalkthroughPanel",
  component: WalkthroughPanel,
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <WalkthroughPanel {...args} />
    </div>
  ),
} satisfies Meta<typeof WalkthroughPanel>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    index: "01",
    eyebrow: "ONBOARDING",
    title: "Beat the empty feed",
    description:
      "A personalised feed is useless if it loads empty. I built the onboarding and the client-side logic that seeds the feed from your picks before the first render.",
    callout: {
      label: "THE CALL —",
      body: "Cached favourites on-device so the first feed paints instantly — no spinner, no cold API round-trip on launch.",
    },
  },
};

export const WithoutCallout: Story = {
  args: {
    index: "05",
    eyebrow: "NEWS",
    title: "Editorial that isn't bolted on",
    description:
      "Long-form video and articles risk feeling like a separate app. I reused the feed's card components for the article renderer.",
  },
};

export const WithExtraContent: Story = {
  args: {
    index: "04",
    eyebrow: "PLAY",
    title: "Make the vote worth casting",
    description: "Polls, predictions and Player-of-the-Match voting.",
    callout: {
      label: "THE CALL —",
      body: "Rendered results optimistically on vote and reconciled with the server.",
    },
    children: (
      <p style={{ fontFamily: "monospace", fontSize: 12 }}>
        (a PollBar would render here)
      </p>
    ),
  },
};
