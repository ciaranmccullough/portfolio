/**
 * App icon registry — the brand/tech glyphs this app uses (currently the hero's
 * floating tech tabs). Each lives in its own file and renders its inline SVG
 * **through the Icon atom** from `@portfolio/ui`, so consumers write
 * `<ReactIcon className="size-4" />` instead of a raw `<svg>`.
 *
 * Generic design-system glyphs (menu, check, alert, close) live in the library
 * itself (`@portfolio/ui` `icons/`); these are the app-specific brand marks.
 */
export * from "./AndroidIcon";
export * from "./CSharpIcon";
export * from "./ClaudeCodeIcon";
export * from "./DotNetIcon";
export * from "./NodeJsIcon";
export * from "./ReactIcon";
export * from "./TypeScriptIcon";
