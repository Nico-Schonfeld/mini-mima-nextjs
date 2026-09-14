import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

function NeedleArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      aria-hidden="true"
      className={cn("text-primary/70", className)}
    >
      <path
        d="M18 96 C 34 58, 78 42, 118 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="128" cy="24" r="9" className="fill-primary" />
      <circle cx="128" cy="24" r="3.4" className="fill-secondary" />
      <path
        d="M42 88 h28 M70 76 h22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-primary/40"
      />
    </svg>
  );
}

export function MediaPlaceholder({
  label,
  className,
  play = false,
  src,
}: {
  label: string;
  className?: string;
  play?: boolean;
  src?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-3xl bg-secondary",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <NeedleArt className="h-28 w-40 md:h-36 md:w-52" />
      )}
      {play ? (
        <span className="absolute inline-flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
      ) : null}
      <span className="absolute right-3 bottom-3 rounded-full bg-background/85 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}
