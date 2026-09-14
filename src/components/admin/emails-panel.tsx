import { Construction } from "lucide-react";

import { AdminHeader } from "@/components/admin/admin-ui";

export function EmailsPanel() {
  return (
    <div>
      <AdminHeader
        title="Emails"
        description="El envío de mails queda deshabilitado por ahora. Lo activamos cuando definamos Resend u otro proveedor."
      />
      <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Construction className="size-5" />
        </span>
        <h2 className="mt-5 font-serif text-2xl font-semibold tracking-tight">
          En mantenimiento
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Acá vas a poder avisar a quienes se inscribieron, abonaron o están por
          empezar. Todavía no hay acciones disponibles.
        </p>
      </div>
    </div>
  );
}
