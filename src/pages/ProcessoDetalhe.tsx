import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, User, Shield, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockCases, mockTasks, mockHearings, mockDeadlines,
  mockEvidenceRequests, mockEvidenceItems, mockCaseChecklists,
  mockResponsaveis,
  statusLabels, taskStatusLabels, priorityLabels,
  evidenceCategoryLabels, evidenceOriginLabels, checklistTypeLabels,
} from "@/data/mock";
import ProvasTab from "@/components/provas/ProvasTab";
import ChecklistsTab from "@/components/checklists/ChecklistsTab";

export default function ProcessoDetalhe() {
  const { id } = useParams();
  const caso = mockCases.find((c) => c.id === id);
  if (!caso) return <div className="p-8 text-muted-foreground">Processo não encontrado.</div>;

  const tasks = mockTasks.filter((t) => t.case_id === id);
  const hearings = mockHearings.filter((h) => h.case_id === id);
  const deadlines = mockDeadlines.filter((d) => d.case_id === id);
  const evidenceRequests = mockEvidenceRequests.filter((r) => r.case_id === id);
  const evidenceItems = mockEvidenceItems.filter((i) => i.case_id === id);
  const checklists = mockCaseChecklists.filter((c) => c.case_id === id);

  // Find linked responsáveis by name match (responsible + lawyer)
  const responsavel = mockResponsaveis.find((r) => r.name === caso.responsible);
  const advogado = mockResponsaveis.find((r) => r.name === caso.lawyer);
  const linkedResponsaveis = [responsavel, advogado].filter(Boolean);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2 gap-1 text-muted-foreground">
          <Link to="/processos"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
        </Button>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{caso.employee}</h1>
              {caso.confidentiality !== "normal" && <Shield className="h-4 w-4 text-destructive" />}
            </div>
            <p className="text-sm text-muted-foreground">{caso.case_number}</p>
            <p className="text-sm text-muted-foreground">{caso.company} – {caso.branch}</p>
          </div>
          <Badge variant="outline">{statusLabels[caso.status]}</Badge>
        </div>
      </div>

      <Tabs defaultValue="resumo">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="prazos">Prazos ({deadlines.length})</TabsTrigger>
          <TabsTrigger value="audiencias">Audiências ({hearings.length})</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas ({tasks.length})</TabsTrigger>
          <TabsTrigger value="provas">Provas ({evidenceRequests.length})</TabsTrigger>
          <TabsTrigger value="checklists">Checklists ({checklists.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold">Dados do Processo</h3>
              <Info icon={<ScaleIcon />} label="Tribunal" value={caso.court} />
              <Info icon={<User className="h-4 w-4" />} label="Responsável" value={caso.responsible} />
              <Info icon={<User className="h-4 w-4" />} label="Advogado" value={caso.lawyer} />
              <Info label="Tema" value={caso.theme} />
              <Info label="Ajuizamento" value={new Date(caso.filed_at).toLocaleDateString("pt-BR")} />
            </div>
            <div className="space-y-4">
              {caso.next_hearing && (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="mb-2 text-sm font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Próxima Audiência</h3>
                  <p className="text-sm">{new Date(caso.next_hearing).toLocaleString("pt-BR")}</p>
                </div>
              )}
              {caso.next_deadline && (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="mb-2 text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-warning" /> Próximo Prazo</h3>
                  <p className="text-sm">{new Date(caso.next_deadline).toLocaleDateString("pt-BR")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Responsáveis vinculados */}
          {linkedResponsaveis.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-3 text-sm font-semibold">Responsáveis & Contatos</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {linkedResponsaveis.map((r) => r && (
                  <div key={r.id} className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.role}</p>
                        <div className="mt-2 space-y-1">
                          <a
                            href={`tel:${r.phone.replace(/\D/g, '')}`}
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Phone className="h-3 w-3" />
                            {r.phone}
                          </a>
                          {r.email && (
                            <a
                              href={`mailto:${r.email}`}
                              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Mail className="h-3 w-3" />
                              {r.email}
                            </a>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {r.alerts_whatsapp && (
                            <a
                              href={`https://wa.me/55${r.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Badge className="gap-1 text-[10px] bg-success/15 text-success border-0 cursor-pointer hover:bg-success/25">
                                <MessageCircle className="h-2.5 w-2.5" /> WhatsApp
                              </Badge>
                            </a>
                          )}
                          {r.alerts_email && (
                            <Badge className="text-[10px] bg-info/15 text-info border-0">
                              <Mail className="mr-1 h-2.5 w-2.5" /> E-mail ativo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prazos">
          <div className="space-y-2">
            {deadlines.length === 0 && <p className="text-sm text-muted-foreground">Nenhum prazo cadastrado.</p>}
            {deadlines.map((d) => (
              <div key={d.id} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">Vencimento: {new Date(d.due_at).toLocaleDateString("pt-BR")}</p>
                <Badge variant="outline" className="mt-2 text-[10px]">{d.status}</Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audiencias">
          <div className="space-y-2">
            {hearings.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma audiência cadastrada.</p>}
            {hearings.map((h) => (
              <div key={h.id} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{h.type}</p>
                <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString("pt-BR")} às {h.time}</p>
                <p className="text-xs text-muted-foreground">{h.court}</p>
                <Badge variant="outline" className="mt-2 text-[10px]">{h.status}</Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tarefas">
          <div className="space-y-2">
            {tasks.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tarefa vinculada.</p>}
            {tasks.map((t) => (
              <div key={t.id} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{t.title}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px]">{taskStatusLabels[t.status]}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{priorityLabels[t.priority]}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t.assignees.join(", ")}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="provas">
          <ProvasTab requests={evidenceRequests} items={evidenceItems} />
        </TabsContent>

        <TabsContent value="checklists">
          <ChecklistsTab checklists={checklists} />
        </TabsContent>

        <TabsContent value="timeline">
          <p className="text-sm text-muted-foreground">Timeline será implementada com o backend.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScaleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>;
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div>
        <span className="text-muted-foreground">{label}: </span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
