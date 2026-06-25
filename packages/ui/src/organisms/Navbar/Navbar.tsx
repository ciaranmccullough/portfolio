"use client";

import { useState } from "react";

import { Icon } from "../../atoms";
import { cn } from "../../cn";
import { NavGroup } from "../../molecules";
import {
  navbarBrandClass,
  navbarClass,
  navbarDesktopClass,
  navbarInnerClass,
  navbarSheetClass,
  navbarSheetInnerClass,
  navbarToggleClass,
} from "./Navbar.styles";
import type { NavbarProps } from "./Navbar.types";

const menuIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <line x1="4" y1="8" x2="20" y2="8" />
    <line x1="4" y1="16" x2="20" y2="16" />
  </svg>
);

/**
 * Navbar — brand, primary navigation and a CTA. The nav collapses into a
 * toggleable sheet on small screens.
 */
export function Navbar({
  brand,
  brandHref,
  items,
  cta,
  className,
  ...props
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={cn(navbarClass, className)} {...props}>
      <div className={navbarInnerClass}>
        {brandHref ? (
          <a href={brandHref} className={navbarBrandClass}>
            {brand}
          </a>
        ) : (
          <span className={navbarBrandClass}>{brand}</span>
        )}
        <div className={navbarDesktopClass}>
          <NavGroup aria-label="Primary" items={items} />
          {cta}
        </div>
        <button
          type="button"
          className={navbarToggleClass}
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon>{menuIcon}</Icon>
        </button>
      </div>
      {open ? (
        <div className={navbarSheetClass}>
          <div className={navbarSheetInnerClass}>
            <NavGroup aria-label="Mobile" items={items} />
            {cta}
          </div>
        </div>
      ) : null}
    </header>
  );
}
