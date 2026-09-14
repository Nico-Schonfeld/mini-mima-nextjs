import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function SheetsSyncNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="mb-4 text-xs font-medium tracking-wide text-primary">
      Sincronizando…
    </p>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-40 rounded-xl" />
      <Skeleton className="mt-2 h-4 w-64 rounded-lg" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <div className="mt-8 flex gap-3">
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
    </div>
  );
}

export function AlumnosSkeleton() {
  return (
    <div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="mt-5 hidden space-y-3 md:block">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function HorariosSkeleton() {
  return (
    <div className="grid max-w-xl gap-5">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-11 w-28 rounded-xl" />
    </div>
  );
}

export function ContenidoSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-36 rounded-2xl" />
      ))}
    </div>
  );
}

export function FormScheduleSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-xl", className)} />;
}
