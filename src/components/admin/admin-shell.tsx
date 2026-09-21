"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Mail,
  Palette,
  Tag,
  Users,
} from "lucide-react";

import { BrandMark } from "@/components/brand/animated-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/alumnos", label: "Alumnos", icon: Users },
  { href: "/admin/horarios", label: "Horarios", icon: CalendarClock },
  { href: "/admin/precio", label: "Precio", icon: Tag },
  { href: "/admin/sitio", label: "Sitio", icon: Palette },
  { href: "/admin/emails", label: "Emails", icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-svh bg-muted/40 pb-20 md:pb-0">
      <aside className="hidden bg-background md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col md:border-r md:border-border">
        <div className="flex h-16 items-center px-5">
          <BrandMark />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-xl"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Salir
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
        <BrandMark />
        <Button variant="ghost" size="sm" onClick={logout}>
          Salir
        </Button>
      </header>

      <div className="md:pl-60">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-6">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
