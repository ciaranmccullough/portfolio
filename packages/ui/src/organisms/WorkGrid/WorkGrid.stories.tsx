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
    projects: [
      { title: "Enterprise design system", tags: ["TypeScript", "React"] },
      { title: "Mobile banking app", tags: ["Kotlin", "Android"] },
      { title: "Realtime dashboard", tags: ["Next.js", "WebSockets"] },
    ],
  },
};
