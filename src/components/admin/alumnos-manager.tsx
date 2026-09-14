"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import {
  AdminHeader,
  AlumnosSkeleton,
  SheetsSyncNotice,
} from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  SCHEDULE_LABELS,
  STATUS_LABELS,
  STUDENT_STATUSES,
  type Schedule,
  type StudentStatus,
} from "@/lib/config";
import type { CourseConfig, Inscription } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = ["todos", ...STUDENT_STATUSES] as const;

export function AlumnosManager() {
  const [items, setItems] = useState<Inscription[]>([]);
  const [config, setConfig] = useState<Partial<CourseConfig> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todos");
  const [pendingDelete, setPendingDelete] = useState<Inscription | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/alumnos");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo cargar.");
    setItems(data.inscriptions ?? []);
    setConfig(data.config ?? null);
  }, []);

  useEffect(() => {
    load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  const visible = useMemo(() => {
    if (filter === "todos") return items;
    return items.filter((item) => item.estado === filter);
  }, [filter, items]);

  async function runSheetsAction(task: () => Promise<void>) {
    setBusy(true);
    try {
      await task();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar.");
    } finally {
      setBusy(false);
    }
  }

  function scheduleLabel(horario: string) {
    const key = horario as Schedule;
    const time =
      key === "manana"
        ? config?.horario_manana
        : key === "tarde"
          ? config?.horario_tarde
          : "";
    const name = SCHEDULE_LABELS[key] ?? horario;
    return time ? `${name} · ${time}` : name;
  }

  const showSkeleton = loading || busy;

  return (
    <div>
      <AdminHeader
        title="Alumnos"
        description="Pagos, bajas y datos de cada inscripción. Los cambios se confirman cuando responde la planilla."
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap",
              filter === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {key === "todos" ? "Todos" : STATUS_LABELS[key]}
          </button>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      <div className="mt-4">
        <SheetsSyncNotice show={showSkeleton} />
      </div>

      {showSkeleton ? (
        <AlumnosSkeleton />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.alumno}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </TableCell>
                    <TableCell>
                      <p>{item.tutor}</p>
                      <p className="text-xs text-muted-foreground">{item.telefono}</p>
                    </TableCell>
                    <TableCell>{item.edad}</TableCell>
                    <TableCell>{scheduleLabel(String(item.horario))}</TableCell>
                    <TableCell>
                      <StatusSelect
                        value={item.estado as StudentStatus}
                        onChange={(estado) =>
                          runSheetsAction(async () => {
                            const res = await fetch(`/api/admin/alumnos/${item.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ estado }),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || "No se pudo actualizar.");
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <Textarea
                        defaultValue={item.nota}
                        className="min-h-10 rounded-xl"
                        onBlur={(e) => {
                          if (e.target.value !== item.nota) {
                            runSheetsAction(async () => {
                              const res = await fetch(`/api/admin/alumnos/${item.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ nota: e.target.value }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || "No se pudo actualizar.");
                            });
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar"
                        onClick={() => setPendingDelete(item)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden">
            {visible.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.alumno}</p>
                    <p className="text-xs text-muted-foreground">{item.tutor}</p>
                  </div>
                  <Badge variant="secondary">
                    {STATUS_LABELS[item.estado as StudentStatus] ?? item.estado}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.edad} años · {scheduleLabel(String(item.horario))} · {item.telefono}
                </p>
                <div className="mt-3">
                  <StatusSelect
                    value={item.estado as StudentStatus}
                    onChange={(estado) =>
                      runSheetsAction(async () => {
                        const res = await fetch(`/api/admin/alumnos/${item.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ estado }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "No se pudo actualizar.");
                      })
                    }
                  />
                </div>
                <Textarea
                  defaultValue={item.nota}
                  className="mt-3 min-h-16 rounded-xl"
                  placeholder="Nota interna"
                  onBlur={(e) => {
                    if (e.target.value !== item.nota) {
                      runSheetsAction(async () => {
                        const res = await fetch(`/api/admin/alumnos/${item.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ nota: e.target.value }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "No se pudo actualizar.");
                      });
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive"
                  onClick={() => setPendingDelete(item)}
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </Button>
              </article>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No hay inscripciones en este filtro.
            </p>
          ) : null}
        </>
      )}

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar inscripción</DialogTitle>
            <DialogDescription>
              Se va a borrar a {pendingDelete?.alumno} de la planilla. Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={!pendingDelete || busy}
              onClick={() =>
                pendingDelete &&
                runSheetsAction(async () => {
                  const res = await fetch(`/api/admin/alumnos/${pendingDelete.id}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "No se pudo eliminar.");
                  setPendingDelete(null);
                })
              }
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: StudentStatus;
  onChange: (value: StudentStatus) => void;
}) {
  return (
    <select
      className="h-9 rounded-xl border border-input bg-transparent px-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value as StudentStatus)}
    >
      {STUDENT_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
