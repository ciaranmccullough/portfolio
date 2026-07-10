import type { Meta, StoryObj } from "@storybook/react";

import { CaseStudyHero } from "./CaseStudyHero";

const meta = {
  title: "Organisms/CaseStudyHero",
  component: CaseStudyHero,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyHero>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "// Case study — EA Sports",
    title: "Bringing fans closer to sports.",
    description:
      "A companion app that turns following football into something you play — not just watch.",
    meta: [
      { label: "ROLE", value: "Software Engineer" },
      { label: "PLATFORM", value: "Android | Jetpack Compose" },
      { label: "YEAR", value: "2024 - Now" },
    ],
    scrollCueLabel: "Scroll to begin",
  },
};

/** The CMS `backgroundImage` asset can be entirely missing/unpublished — the hero still reads fine. */
export const WithoutBackgroundImage: Story = {
  args: {
    ...Default.args,
    backgroundImage: undefined,
  },
};

/** A minimal hero with only the required title. */
export const MinimalContent: Story = {
  args: {
    title: "Bringing fans closer to sports.",
  },
};
