import type { HeroTab } from "@portfolio/ui";

import {
  AndroidIcon,
  CSharpIcon,
  ClaudeCodeIcon,
  DotNetIcon,
  NodeJsIcon,
  ReactIcon,
  TypeScriptIcon,
} from "../icons";

/*
 * The hero's floating tech tabs, in display order. Each icon is a named glyph
 * from the app icon registry (`app/icons`) that renders through the Icon atom;
 * `size-4` matches the tab's compact label.
 */
export const heroTabs: HeroTab[] = [
  {
    title: "Claude Code",
    icon: <ClaudeCodeIcon className="size-4" />,
    className: "bg-[#f7e8e0]",
  },
  {
    title: "React",
    icon: <ReactIcon className="size-4" />,
    className: "bg-[#dbf4fd]",
  },
  {
    title: "Android",
    icon: <AndroidIcon className="size-4" />,
    className: "bg-[#e0f5e8]",
  },
  {
    title: "TypeScript",
    icon: <TypeScriptIcon className="size-4" />,
    className: "bg-[#dde9fb]",
  },
  {
    title: "NodeJS",
    icon: <NodeJsIcon className="size-4" />,
    className: "bg-[#ecf6d9]",
  },
  {
    title: ".NET",
    icon: <DotNetIcon className="size-4" />,
    className: "bg-[#ece5f6]",
  },
  {
    title: "C#",
    icon: <CSharpIcon className="size-4" />,
    className: "bg-[#f3e8f3]",
  },
];
