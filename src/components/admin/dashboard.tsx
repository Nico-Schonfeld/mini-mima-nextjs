"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, CircleDollarSign, Users, Wallet } from "lucide-react";

import {
  AdminHeader,
  DashboardSkeleton,
  SheetsSyncNotice,
} from "@/components/admin/admin-ui";
import { buttonVariants } from "@/components/ui/button";
import type { Inscription, Occupancy } from "@/lib/types";
import { cn } from "@/lib/utils";

type ListPayload = {
  ok?: boolean;
  inscriptions?: Inscription[];
  occupancy?: Occupancy;
  config?: Record<string, string>;
  error?: string;
};

export function AdminDashboard() {
  const [data, setData] = useState<ListPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/alumnos")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "No se pudo cargar.");
        setData(json);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <AdminHeader
          title="Resumen"
          description="Vista rápida de inscripciones, pagos y cupos."
        />
        <SheetsSyncNotice show />
        <DashboardSkeleton />
      </div>
    );
  }

  const inscriptions = (data?.inscriptions ?? []).filter(
    (item) => item.estado !== "baja"
  );
  const paid = inscriptions.filter(
    (item) => item.estado === "abonado" || item.estado === "confirmado"
  ).length;
  const pending = inscriptions.filter((item) => item.estado === "pendiente").length;
  const occupancy = data?.occupancy;
  const mananaLabel = data?.config?.horario_manana || "Mañana";
  const tardeLabel = data?.config?.horario_tarde || "Tarde";

  return (
    <div>
      <AdminHeader
        title="Resumen"
        description="Vista rápida de inscripciones, pagos y cupos."
      />

      {error ? (
        <p className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Alumnos activos" value={String(inscriptions.length)} />
        <StatCard icon={CircleDollarSign} label="Abonaron" value={String(paid)} />
        <StatCard icon={Wallet} label="Pendientes de pago" value={String(pending)} />
        <StatCard
          icon={CalendarClock}
          label="Cupos libres"
          value={
            occupancy
              ? String(occupancy.manana.disponibles + occupancy.tarde.disponibles)
              : "—"
          }
        />
      </div>

      {occupancy ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <SlotCard title={`Mañana · ${mananaLabel}`} slot={occupancy.manana} />
          <SlotCard title={`Tarde · ${tardeLabel}`} slot={occupancy.tarde} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/admin/alumnos" className={cn(buttonVariants(), "h-11 rounded-xl")}>
          Ver alumnos
        </Link>
        <Link
          href="/admin/horarios"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl")}
        >
          Configurar horarios
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function SlotCard({
  title,
  slot,
}: {
  title: string;
  slot: Occupancy["manana"];
}) {
  const percent = slot.max ? Math.min(100, (slot.ocupados / slot.max) * 100) : 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {slot.ocupados}/{slot.max}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {slot.disponibles} cupos disponibles
      </p>
    </div>
  );
}
