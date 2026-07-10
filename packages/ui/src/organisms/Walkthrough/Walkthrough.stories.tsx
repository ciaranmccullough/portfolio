import type { Meta, StoryObj } from "@storybook/react";

import { PollBar } from "../../molecules";
import { Walkthrough } from "./Walkthrough";
import type { WalkthroughItem } from "./Walkthrough.types";

const meta = {
  title: "Organisms/Walkthrough",
  component: Walkthrough,
  tags: ["autodocs"],
} satisfies Meta<typeof Walkthrough>;
export default meta;

type Story = StoryObj<typeof meta>;

const items: WalkthroughItem[] = [
  {
    eyebrow: "ONBOARDING",
    title: "Beat the empty feed",
    description:
      "A personalised feed is useless if it loads empty. I built the onboarding and the client-side logic that seeds the feed from your picks before the first render.",
    callout: {
      label: "THE CALL —",
      body: "Cached favourites on-device so the first feed paints instantly — no spinner, no cold API round-trip on launch.",
    },
  },
  {
    eyebrow: "HOME",
    title: "One feed, every content type",
    description:
      "Scores, video, polls and editorial all live in one feed, driven by a typed schema with one renderer per card type.",
  },
  {
    eyebrow: "SCORES",
    title: "Live, without the jank",
    description:
      "Fixtures update in real time via a live-scores data layer — subscriptions, optimistic updates and a virtualised list.",
  },
  {
    eyebrow: "PLAY",
    title: "Make the vote worth casting",
    description: "Polls, predictions and Player-of-the-Match voting.",
    callout: {
      label: "THE CALL —",
      body: "Rendered results optimistically on vote and reconciled with the server.",
    },
    extra: (
      <PollBar
        options={[
          { label: "Bellingham", value: 57, leading: true },
          { label: "Kane", value: 19 },
          { label: "Saka", value: 6 },
        ]}
      />
    ),
  },
  {
    eyebrow: "NEWS",
    title: "Editorial that isn't bolted on",
    description:
      "Long-form video and articles reuse the feed's card components.",
  },
];

export const Default: Story = {
  args: {
    eyebrow: "// The walkthrough",
    title: "Five surfaces, one story",
    items,
  },
};

/** The real CMS data's "Onboarding" item ships with a blank image field. */
export const WithMissingFirstImage: Story = {
  args: {
    title: "Five surfaces, one story",
    items,
    imageFallback: "Preview coming soon",
  },
};
