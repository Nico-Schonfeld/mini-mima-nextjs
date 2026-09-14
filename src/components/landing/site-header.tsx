"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { BrandMark } from "@/components/brand/animated-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#curso", label: "El curso" },
  { href: "/#diferencia", label: "Cómo es" },
  { href: "/#testimonios", label: "Testimonios" },
];

export function SiteHeader({
  name = "MiniMima!",
  logo,
  cta = "Inscribirme",
  showTestimonials = true,
}: {
  name?: string;
  logo?: string;
  cta?: string;
  showTestimonials?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:h-16 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark name={name} logo={logo} />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV.filter(
            (item) => showTestimonials || item.href !== "/#testimonios"
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/inscripcion"
            className={cn(buttonVariants({ size: "sm" }), "h-9 rounded-xl px-4")}
          >
            {cta}
          </Link>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menú"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetHeader>
              <SheetTitle className="font-serif text-xl">{name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV.filter(
                (item) => showTestimonials || item.href !== "/#testimonios"
              ).map((item) => (
                <SheetClose
                  key={item.href}
                  render={
                    <Link
                      href={item.href}
                      className="rounded-xl px-2 py-3 text-base text-foreground"
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto p-4">
              <SheetClose
                render={
                  <Link
                    href="/inscripcion"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 w-full rounded-xl text-base"
                    )}
                  />
                }
              >
                {cta}
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
