"use client";

import { motion } from "motion/react";
import { Navbar, type NavbarProps } from "@portfolio/ui";

import { useHideOnScroll } from "@/lib/useHideOnScroll";

/**
 * SiteNav — app-level wrapper that pins the Navbar and animates it out of view
 * on scroll-down / back into view on scroll-up, driven by {@link useHideOnScroll}.
 *
 * Motion lives here in apps/web, never in @portfolio/ui: the Navbar stays a
 * presentational component and this wrapper owns positioning + animation.
 */
export function SiteNav(props: NavbarProps) {
  const hidden = useHideOnScroll();

  return (
    <motion.div
      className="sticky top-0 z-50"
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Navbar {...props} />
    </motion.div>
  );
}
