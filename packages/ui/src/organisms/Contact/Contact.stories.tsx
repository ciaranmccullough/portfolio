import type { Meta, StoryObj } from "@storybook/react";

import { FormField } from "../../molecules";
import { Contact } from "./Contact";

const meta = {
  title: "Organisms/Contact",
  component: Contact,
  tags: ["autodocs"],
} satisfies Meta<typeof Contact>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Let's build something.",
    intro: "Have a project in mind? Send a note and I'll get back to you.",
    children: (
      <>
        <FormField label="Name" name="name" />
        <FormField label="Email" name="email" type="email" />
      </>
    ),
  },
};
