import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const phases = [
  { id: 0, name: "Fase 0 – Fundação", weeks: "1–2", deliverables: "Multi-tenant, RLS, navegação, protótipo", status: "critico" as const, progress: 100 },
  { id: 1, name: "Fase 1 – Núcleo", weeks: "3–6", deliverables: "Processos, Tarefas, Prazos, Audiências, Timeline, ACL, Portal Advogado", status: "critico" as const, progress: 100 },
  { id: 2, name: "Fase 2 – Agenda e Alertas", weeks: "7–9", deliverables: "Calendário, Alertas in-app e e-mail, Escalonamento", status: "critico" as const, progress: 100 },
  { id: 3, name: "Fase 3 – Provas", weeks: "10–12", deliverables: "Solicitação de prova, SLA, Upload, Metadados, Marca d'água", status: "critico" as const, progress: 100 },
  { id: 4, name: "Fase 4 – Integrações e IA", weeks: "13–16", deliverables: "WhatsApp, E-mail ingest, Drive, IA classificador, Automações", status: "importante" as const, progress: 100 },
  { id: 5, name: "Fase 5 – Governança e Go-live", weeks: "17–18", deliverables: "Relatórios, Auditoria, Treinamento, Documentação, Go-live", status: "critico" as const, progress: 100 },
];

const statusConfig = {
  critico: { label: "Crítico", emoji: "🟢", color: "bg-success/10 text-success border-success/30" },
  importante: { label: "Importante", emoji: "🟡", color: "bg-warning/15 text-warning border-warning/30" },
};

export default function Cronograma() {
  const totalWeeks = 18;

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">📊 Cronograma do Projeto</h1>
        <p className="text-sm text-muted-foreground">Visão geral das fases e entregas</p>
      </div>

      {/* Gantt-style bars */}
      <div className="mb-8 rounded-xl border bg-card p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Week header */}
          <div className="mb-1 flex items-center gap-2">
            <div className="w-48 shrink-0" />
            <div className="flex flex-1">
              {Array.from({ length: totalWeeks }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[9px] text-muted-foreground font-medium">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Phase bars */}
          {phases.map((phase) => {
            const [startStr, endStr] = phase.weeks.split("–");
            const start = parseInt(startStr);
            const end = parseInt(endStr);
            const leftPct = ((start - 1) / totalWeeks) * 100;
            const widthPct = ((end - start + 1) / totalWeeks) * 100;
            const cfg = statusConfig[phase.status];

            return (
              <div key={phase.id} className="flex items-center gap-2 py-1.5">
                <div className="w-48 shrink-0 text-xs font-medium truncate">{phase.name}</div>
                <div className="relative flex-1 h-7 rounded bg-muted/30">
                  <div
                    className={cn(
                      "absolute top-0 h-full rounded flex items-center justify-center text-[10px] font-semibold transition-all",
                      phase.status === "critico" ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"
                    )}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    S{start}–{end}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail cards */}
      <div className="relative ml-4 border-l-2 border-border pl-6 space-y-4">
        {phases.map((phase, idx) => {
          const cfg = statusConfig[phase.status];
          return (
            <div
              key={phase.id}
              className="relative animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className={cn(
                "absolute -left-[calc(1.5rem+5px)] flex h-6 w-6 items-center justify-center rounded-full text-[11px]",
                phase.progress === 100 ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
              )}>
                {phase.progress === 100 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold">{phase.name}</h3>
                  <Badge variant="outline" className={cn("text-[10px]", cfg.color)}>
                    {cfg.emoji} {cfg.label}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">Semanas {phase.weeks}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{phase.deliverables}</p>
                <div className="flex items-center gap-2">
                  <Progress value={phase.progress} className="h-1.5 flex-1" />
                  <span className="text-[10px] font-semibold text-muted-foreground">{phase.progress}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
