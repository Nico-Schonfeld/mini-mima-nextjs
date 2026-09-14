import type { CSSProperties } from "react";

import type { SiteTheme } from "@/lib/site-content";

export function publicThemeStyle(theme: SiteTheme): CSSProperties {
  return {
    "--primary": theme.primary,
    "--ring": theme.primary,
    "--sidebar-primary": theme.primary,
    "--background": theme.background,
    "--sidebar": theme.background,
  } as CSSProperties;
}
