import { useState } from "react";
import {
  BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle2, FileText,
  Building2, Filter, Download, Users, Shield, CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import {
  mockCases, mockTasks, mockDeadlines, mockEvidenceRequests,
  mockAlerts, mockCompanies, mockDownloadLogs, mockEvidenceItems,
  statusLabels, type CaseStatus, taskStatusLabels,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const CHART_COLORS = [
  "hsl(230, 65%, 48%)",
  "hsl(38, 92%, 50%)",
  "hsl(152, 60%, 40%)",
  "hsl(0, 72%, 51%)",
  "hsl(210, 80%, 52%)",
  "hsl(270, 50%, 55%)",
];

export default function Relatorios() {
  const [companyFilter, setCompanyFilter] = useState("todas");
  const [tab, setTab] = useState("visao-geral");

  const filteredCases = companyFilter === "todas"
    ? mockCases
    : mockCases.filter((c) => c.company_id === companyFilter);
  const caseIds = new Set(filteredCases.map((c) => c.id));

  // KPIs
  const totalRequests = mockEvidenceRequests.filter((r) => caseIds.has(r.case_id));
  const slaMet = totalRequests.filter((r) => r.status === "atendida").length;
  const slaPercent = totalRequests.length > 0 ? Math.round((slaMet / totalRequests.length) * 100) : 0;
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "urgente" && !a.treated).length;
  const overdueTasks = mockTasks.filter((t) => t.status !== "concluida" && caseIds.has(t.case_id || "") && new Date(t.due_at) < new Date()).length;
  const totalEvidence = mockEvidenceItems.filter((i) => caseIds.has(i.case_id)).length;
  const validatedEvidence = mockEvidenceItems.filter((i) => caseIds.has(i.case_id) && i.status === "validado").length;

  // Charts
  const statusData = (Object.entries(statusLabels) as [CaseStatus, string][])
    .map(([key, label]) => ({ name: label, value: filteredCases.filter((c) => c.status === key).length }))
    .filter((d) => d.value > 0);

  const themeData = Object.entries(
    filteredCases.reduce((acc, c) => { acc[c.theme] = (acc[c.theme] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const companyData = mockCompanies
    .map((co) => ({
      name: co.name.replace("Revalle ", ""),
      processos: mockCases.filter((c) => c.company_id === co.id).length,
      tarefas: mockTasks.filter((t) => mockCases.find((c) => c.id === t.case_id && c.company_id === co.id)).length,
    }))
    .filter((d) => d.processos > 0 || d.tarefas > 0);

  const monthlyData = [
    { month: "Set", novos: 1, encerrados: 0, sla: 100 },
    { month: "Out", novos: 0, encerrados: 0, sla: 100 },
    { month: "Nov", novos: 1, encerrados: 0, sla: 80 },
    { month: "Dez", novos: 0, encerrados: 0, sla: 90 },
    { month: "Jan", novos: 1, encerrados: 0, sla: 75 },
    { month: "Fev", novos: 2, encerrados: 1, sla: 33 },
  ];

  // Task by assignee
  const assigneeCounts: Record<string, { total: number; concluida: number; pendente: number }> = {};
  mockTasks.filter((t) => !t.case_id || caseIds.has(t.case_id)).forEach((t) => {
    t.assignees.forEach((a) => {
      if (!assigneeCounts[a]) assigneeCounts[a] = { total: 0, concluida: 0, pendente: 0 };
      assigneeCounts[a].total++;
      if (t.status === "concluida") assigneeCounts[a].concluida++;
      else assigneeCounts[a].pendente++;
    });
  });
  const assigneeData = Object.entries(assigneeCounts)
    .map(([name, v]) => ({ name: name.split(" ")[0], concluidas: v.concluida, pendentes: v.pendente }))
    .sort((a, b) => (b.concluidas + b.pendentes) - (a.concluidas + a.pendentes));

  // Radar data for operational health
  const radarData = [
    { metric: "SLA Provas", value: slaPercent },
    { metric: "Alertas Tratados", value: mockAlerts.length > 0 ? Math.round((mockAlerts.filter((a) => a.treated).length / mockAlerts.length) * 100) : 100 },
    { metric: "Tarefas Concluídas", value: mockTasks.length > 0 ? Math.round((mockTasks.filter((t) => t.status === "concluida").length / mockTasks.length) * 100) : 100 },
    { metric: "Provas Validadas", value: totalEvidence > 0 ? Math.round((validatedEvidence / totalEvidence) * 100) : 100 },
    { metric: "Prazos Cumpridos", value: mockDeadlines.length > 0 ? Math.round((mockDeadlines.filter((d) => d.status === "cumprido").length / mockDeadlines.length) * 100) : 100 },
  ];

  const handleExport = (format: string) => {
    toast({ title: `📥 Exportação ${format.toUpperCase()}`, description: `Relatório exportado em ${format.toUpperCase()}. (Demo)` });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios & Dashboards</h1>
          <p className="text-sm text-muted-foreground">KPIs operacionais e análise executiva</p>
        </div>
        <div className="flex gap-2">
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as empresas</SelectItem>
              {mockCompanies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => handleExport("pdf")}>
            <Download className="h-3.5 w-3.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => handleExport("xlsx")}>
            <Download className="h-3.5 w-3.5" /> Excel
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="visao-geral" className="text-xs">Visão Geral</TabsTrigger>
          <TabsTrigger value="processos" className="text-xs">Processos</TabsTrigger>
          <TabsTrigger value="operacional" className="text-xs">Operacional</TabsTrigger>
          <TabsTrigger value="sla" className="text-xs">SLA & Provas</TabsTrigger>
        </TabsList>

        {/* VISÃO GERAL */}
        <TabsContent value="visao-geral">
          {/* KPI Cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KPICard icon={<CheckCircle2 />} label="SLA Provas 72h" value={`${slaPercent}%`} sub={`${slaMet}/${totalRequests.length} cumpridos`} color="text-success" bg="bg-success/10" />
            <KPICard icon={<AlertTriangle />} label="Alertas Críticos" value={String(criticalAlerts)} sub="não tratados" color="text-destructive" bg="bg-destructive/10" />
            <KPICard icon={<Clock />} label="Tarefas Vencidas" value={String(overdueTasks)} sub="em atraso" color="text-warning" bg="bg-warning/10" />
            <KPICard icon={<FileText />} label="Evidências" value={`${validatedEvidence}/${totalEvidence}`} sub="validadas" color="text-info" bg="bg-info/10" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Saúde Operacional" icon={<Shield className="h-4 w-4 text-primary" />}>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(220, 16%, 85%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="%" dataKey="value" stroke="hsl(230, 65%, 48%)" fill="hsl(230, 65%, 48%)" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Evolução Mensal" icon={<TrendingUp className="h-4 w-4 text-success" />}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="novos" stroke="hsl(230, 65%, 48%)" fill="hsl(230, 65%, 48%)" fillOpacity={0.15} name="Novos" />
                  <Area type="monotone" dataKey="encerrados" stroke="hsl(152, 60%, 40%)" fill="hsl(152, 60%, 40%)" fillOpacity={0.15} name="Encerrados" />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        {/* PROCESSOS */}
        <TabsContent value="processos">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Processos por Status" icon={<BarChart3 className="h-4 w-4 text-primary" />}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Volume por Tema" icon={<FileText className="h-4 w-4 text-info" />}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={themeData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(230, 65%, 48%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Por Empresa / Filial" icon={<Building2 className="h-4 w-4 text-warning" />}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="processos" fill="hsl(230, 65%, 48%)" name="Processos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tarefas" fill="hsl(38, 92%, 50%)" name="Tarefas" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Confidentiality breakdown */}
            <ChartCard title="Sigilo dos Processos" icon={<Shield className="h-4 w-4 text-destructive" />}>
              <div className="space-y-4 pt-4">
                {(["normal", "restrito", "ultra_restrito"] as const).map((level) => {
                  const count = filteredCases.filter((c) => c.confidentiality === level).length;
                  const pct = filteredCases.length > 0 ? Math.round((count / filteredCases.length) * 100) : 0;
                  const labels = { normal: "Normal", restrito: "Restrito", ultra_restrito: "Ultra Restrito" };
                  const colors = { normal: "bg-success", restrito: "bg-warning", ultra_restrito: "bg-destructive" };
                  return (
                    <div key={level}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium">{labels[level]}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full transition-all", colors[level])} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        {/* OPERACIONAL */}
        <TabsContent value="operacional">
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KPICard icon={<Users />} label="Responsáveis Ativos" value="5" sub="com alertas configurados" color="text-primary" bg="bg-primary/10" />
            <KPICard icon={<CalendarDays />} label="Audiências Próx. 30d" value={String(mockDeadlines.filter((d) => d.status === "pendente").length)} sub="agendadas" color="text-warning" bg="bg-warning/10" />
            <KPICard icon={<Shield />} label="Downloads c/ Marca" value={String(mockDownloadLogs.filter((d) => d.watermarked).length)} sub="com marca d'água" color="text-info" bg="bg-info/10" />
            <KPICard icon={<TrendingUp />} label="Tempo Médio Resposta" value="4.2d" sub="citação → documentação" color="text-success" bg="bg-success/10" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Tarefas por Responsável" icon={<Users className="h-4 w-4 text-primary" />}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={assigneeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="concluidas" fill="hsl(152, 60%, 40%)" name="Concluídas" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pendentes" fill="hsl(38, 92%, 50%)" name="Pendentes" stackId="a" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="SLA Compliance Mensal" icon={<CheckCircle2 className="h-4 w-4 text-success" />}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Area type="monotone" dataKey="sla" stroke="hsl(152, 60%, 40%)" fill="hsl(152, 60%, 40%)" fillOpacity={0.2} name="SLA %" />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        {/* SLA & PROVAS */}
        <TabsContent value="sla">
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KPICard icon={<CheckCircle2 />} label="SLA Cumprido" value={`${slaPercent}%`} sub={`${slaMet} de ${totalRequests.length}`} color="text-success" bg="bg-success/10" />
            <KPICard icon={<AlertTriangle />} label="Atrasados" value={String(totalRequests.filter((r) => r.status === "atrasada").length)} sub="solicitações" color="text-destructive" bg="bg-destructive/10" />
            <KPICard icon={<FileText />} label="Total Evidências" value={String(totalEvidence)} sub={`${validatedEvidence} validadas`} color="text-info" bg="bg-info/10" />
            <KPICard icon={<Download />} label="Downloads" value={String(mockDownloadLogs.length)} sub={`${mockDownloadLogs.filter((d) => d.watermarked).length} c/ marca`} color="text-primary" bg="bg-primary/10" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Status das Solicitações" icon={<BarChart3 className="h-4 w-4 text-primary" />}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Aberta", value: totalRequests.filter((r) => r.status === "aberta").length },
                      { name: "Parcial", value: totalRequests.filter((r) => r.status === "parcialmente_atendida").length },
                      { name: "Atendida", value: totalRequests.filter((r) => r.status === "atendida").length },
                      { name: "Atrasada", value: totalRequests.filter((r) => r.status === "atrasada").length },
                    ].filter((d) => d.value > 0)}
                    dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`} labelLine={false}
                  >
                    <Cell fill="hsl(210, 80%, 52%)" />
                    <Cell fill="hsl(38, 92%, 50%)" />
                    <Cell fill="hsl(152, 60%, 40%)" />
                    <Cell fill="hsl(0, 72%, 51%)" />
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Evidências por Categoria" icon={<FileText className="h-4 w-4 text-info" />}>
              <div className="space-y-3 pt-2">
                {Object.entries(
                  mockEvidenceItems.reduce((acc, i) => {
                    const cat = i.category.replace(/_/g, " ");
                    acc[cat] = (acc[cat] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).sort((a, b) => b[1] - a[1]).map(([cat, count], i) => (
                  <div key={cat}>
                    <div className="mb-0.5 flex justify-between text-xs">
                      <span className="font-medium capitalize">{cat}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${(count / mockEvidenceItems.length) * 100}%`,
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPICard({ icon, label, value, sub, color, bg }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className={cn("mb-2 flex h-9 w-9 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5", bg, color)}>{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground/70">{sub}</p>
    </div>
  );
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
