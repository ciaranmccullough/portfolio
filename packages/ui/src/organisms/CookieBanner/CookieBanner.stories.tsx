import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { CookieBanner } from "./CookieBanner";
import type { CookiePreferences } from "./CookieBanner.types";

const meta = {
  title: "Organisms/CookieBanner",
  component: CookieBanner,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof CookieBanner>;
export default meta;

type Story = StoryObj<typeof meta>;

const noop = () => {};

export const Summary: Story = {
  args: {
    open: true,
    onAcceptAll: noop,
    onRejectAll: noop,
    onSavePreferences: noop,
    privacyHref: "#privacy",
  },
};

/** Fully interactive: toggle categories, expand into preferences, persist. */
export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [prefs, setPrefs] = useState<CookiePreferences>();
    return (
      <div style={{ minHeight: "70vh" }}>
        <button type="button" onClick={() => setOpen(true)}>
          Reopen cookie banner
        </button>
        <CookieBanner
          {...args}
          open={open}
          preferences={prefs}
          onAcceptAll={() => {
            setPrefs({
              necessary: true,
              functional: true,
              analytics: true,
              marketing: true,
            });
            setOpen(false);
          }}
          onRejectAll={() => {
            setPrefs({
              necessary: true,
              functional: false,
              analytics: false,
              marketing: false,
            });
            setOpen(false);
          }}
          onSavePreferences={(next) => {
            setPrefs(next);
            setOpen(false);
          }}
        />
      </div>
    );
  },
  args: {
    open: true,
    onAcceptAll: noop,
    onRejectAll: noop,
    onSavePreferences: noop,
    privacyHref: "#privacy",
  },
};
