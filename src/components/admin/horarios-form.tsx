"use client";

import { useEffect, useState } from "react";

import {
  AdminHeader,
  HorariosSkeleton,
  SheetsSyncNotice,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CourseConfig, Occupancy } from "@/lib/types";

export function HorariosForm() {
  const [config, setConfig] = useState<CourseConfig>({
    cupos_manana: "8",
    cupos_tarde: "8",
    horario_manana: "10:00 a 12:00",
    horario_tarde: "16:00 a 18:00",
  });
  const [occupancy, setOccupancy] = useState<Occupancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/alumnos");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo cargar.");
    if (data.config) {
      setConfig({
        cupos_manana: String(data.config.cupos_manana ?? "8"),
        cupos_tarde: String(data.config.cupos_tarde ?? "8"),
        horario_manana: String(data.config.horario_manana ?? ""),
        horario_tarde: String(data.config.horario_tarde ?? ""),
      });
    }
    if (data.occupancy) setOccupancy(data.occupancy);
  }

  useEffect(() => {
    load()
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      await load();
      setMessage("Horarios y cupos actualizados. Ya se ven en la inscripción.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setBusy(false);
    }
  }

  const showSkeleton = loading || busy;

  return (
    <div>
      <AdminHeader
        title="Horarios y cupos"
        description="Se guardan en la pestaña Config de Google Sheets. El formulario de inscripción lee estos valores (horario de cada turno y cupos libres)."
      />
      <SheetsSyncNotice show={showSkeleton} />

      {showSkeleton ? (
        <HorariosSkeleton />
      ) : (
        <form onSubmit={onSubmit} className="grid max-w-xl gap-5">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
            <Field label="Turno mañana">
              <Input
                className="h-11 rounded-xl"
                value={config.horario_manana}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, horario_manana: e.target.value }))
                }
              />
            </Field>
            <Field label="Cupos mañana">
              <Input
                className="h-11 rounded-xl"
                type="number"
                min={1}
                value={config.cupos_manana}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, cupos_manana: e.target.value }))
                }
              />
            </Field>
            {occupancy ? (
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Ocupados mañana: {occupancy.manana.ocupados}. Libres:{" "}
                {occupancy.manana.disponibles}.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
            <Field label="Turno tarde">
              <Input
                className="h-11 rounded-xl"
                value={config.horario_tarde}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, horario_tarde: e.target.value }))
                }
              />
            </Field>
            <Field label="Cupos tarde">
              <Input
                className="h-11 rounded-xl"
                type="number"
                min={1}
                value={config.cupos_tarde}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, cupos_tarde: e.target.value }))
                }
              />
            </Field>
            {occupancy ? (
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Ocupados tarde: {occupancy.tarde.ocupados}. Libres:{" "}
                {occupancy.tarde.disponibles}.
              </p>
            ) : null}
          </div>

          <Button type="submit" className="h-11 w-fit rounded-xl">
            Guardar
          </Button>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
