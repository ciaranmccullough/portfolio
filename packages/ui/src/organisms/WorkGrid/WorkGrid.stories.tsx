import type { Meta, StoryObj } from "@storybook/react";

import { WorkGrid } from "./WorkGrid";

const meta = {
  title: "Organisms/WorkGrid",
  component: WorkGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof WorkGrid>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "01 — Selected work",
    title: "Things I've shipped",
    meta: "// 3 of many",
    projects: [
      {
        title: "Enterprise design system",
        description:
          "A cross-platform component library powering 20+ internal apps, with shared tokens and full accessibility.",
        tags: ["TypeScript", "React"],
        href: "#",
      },
      {
        title: "Mobile banking app",
        description:
          "Offline-first banking with native Android modules and conflict-free background sync.",
        tags: ["Kotlin", "Android"],
        href: "#",
      },
      {
        title: "Realtime dashboard",
        description: "Live metrics streamed over WebSockets at a steady 60fps.",
        tags: ["Next.js", "WebSockets"],
        href: "#",
      },
    ],
  },
};
