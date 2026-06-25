import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../atoms";
import { Navbar } from "./Navbar";

const meta = {
  title: "Organisms/Navbar",
  component: Navbar,
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: "Ciaran",
    items: [
      { href: "#work", label: "Work" },
      { href: "#stack", label: "Stack" },
      { href: "#about", label: "About" },
    ],
    cta: <Button size="sm">Get in touch</Button>,
  },
};
