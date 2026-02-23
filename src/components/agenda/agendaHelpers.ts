import {
  mockHearings, mockDeadlines, mockTasks, mockCases,
} from "@/data/mock";
import type { AppRole } from "@/contexts/AuthContext";

// ── Constants ──
export const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
export const WEEKDAYS_FULL = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
export const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
export const TODAY = new Date();

export type ViewType = "dia" | "semana" | "mes" | "ano";
export type EventFilterType = "todos" | "audiencia" | "prazo" | "tarefa";
export type AssignmentFilter = "todos" | "minhas";

export interface CalendarEvent {
  type: "audiencia" | "prazo" | "tarefa";
  title: string;
  time?: string;
  hour?: number;
  date?: string;
  employee?: string;
  caseId?: string;
  caseNumber?: string;
  companyId?: string;
  detail?: string;
  assignees?: string[];
}

/** Retorna true se o caso é visível para o usuário com o papel/nome dados */
function canUserSeeCase(caso: { responsible: string; lawyer: string; responsible_sector?: string } | undefined, userName: string, userRole: AppRole | undefined): boolean {
  if (!caso) return false;
  if (!userRole || userRole === "admin" || userRole === "responsavel_juridico_interno") return true;
  if (userRole === "advogado_externo") return caso.lawyer === userName;
  if (userRole === "dp") return caso.responsible === userName || caso.responsible_sector === "dp";
  if (userRole === "rh") return caso.responsible === userName || caso.responsible_sector === "rh";
  if (userRole === "vendas") return caso.responsible_sector === "vendas";
  if (userRole === "logistica") return caso.responsible_sector === "logistica";
  if (userRole === "frota") return caso.responsible_sector === "frota";
  return false;
}

export function formatDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function getEventsForDate(
  date: Date,
  typeFilter: EventFilterType,
  assignmentFilter: AssignmentFilter,
  companyFilter: string,
  currentUser?: string,
  userRole?: AppRole
): CalendarEvent[] {
  const dateStr = formatDateStr(date);
  const items: CalendarEvent[] = [];
  const user = currentUser ?? "Thiago";

  if (typeFilter === "todos" || typeFilter === "audiencia") {
    mockHearings.forEach((h) => {
      if (h.date !== dateStr) return;
      const caso = mockCases.find((c) => c.id === h.case_id);
      if (caso?.status === "encerrado") return;
      if (!canUserSeeCase(caso, user, userRole)) return;
      if (companyFilter !== "todas" && caso?.company_id !== companyFilter) return;
      if (assignmentFilter === "minhas" && caso?.responsible !== user) return;
      items.push({
        type: "audiencia", title: h.type, time: h.time, date: h.date,
        hour: parseInt(h.time.split(":")[0]), employee: h.employee,
        caseId: h.case_id, caseNumber: h.case_number,
        companyId: caso?.company_id, detail: h.court,
      });
    });
  }

  if (typeFilter === "todos" || typeFilter === "prazo") {
    mockDeadlines.forEach((d) => {
      if (d.due_at !== dateStr) return;
      if (d.status === "cumprido") return;
      const caso = mockCases.find((c) => c.id === d.case_id);
      if (!canUserSeeCase(caso, user, userRole)) return;
      if (companyFilter !== "todas" && caso?.company_id !== companyFilter) return;
      if (assignmentFilter === "minhas" && caso?.responsible !== user) return;
      items.push({
        type: "prazo", title: d.title, date: d.due_at, employee: d.employee,
        caseId: d.case_id, caseNumber: d.case_number, companyId: caso?.company_id,
      });
    });
  }

  if (typeFilter === "todos" || typeFilter === "tarefa") {
    mockTasks.filter((t) => t.show_in_calendar).forEach((t) => {
      if (!t.due_at.startsWith(dateStr)) return;
      if (t.status === "concluida") return;
      const caso = t.case_id ? mockCases.find((c) => c.id === t.case_id) : undefined;
      const caseVisible = caso ? canUserSeeCase(caso, user, userRole) : true;
      const isAssignee = t.assignees.includes(user);
      const sectorOnly = userRole === "vendas" || userRole === "logistica" || userRole === "frota";
      if (sectorOnly && !isAssignee) return;
      if (!sectorOnly && !caseVisible && !isAssignee) return;
      if (companyFilter !== "todas" && caso && caso.company_id !== companyFilter) return;
      if (assignmentFilter === "minhas" && !t.assignees.includes(user)) return;
      const time = t.due_at.split("T")[1]?.slice(0,5);
      items.push({
        type: "tarefa", title: t.title, time, date: dateStr,
        hour: time ? parseInt(time.split(":")[0]) : undefined,
        employee: t.employee, caseId: t.case_id, caseNumber: t.case_number,
        companyId: caso?.company_id, assignees: t.assignees,
      });
    });
  }

  return items;
}

export function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => { const dd = new Date(d); dd.setDate(d.getDate()+i); return dd; });
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

export function eventColor(type: string) {
  if (type === "audiencia") return "bg-primary/15 text-primary border-l-2 border-primary";
  if (type === "prazo") return "bg-warning/15 text-warning border-l-2 border-warning";
  return "bg-success/15 text-success border-l-2 border-success";
}

export function allDayColor(type: string) {
  if (type === "prazo") return "bg-warning/20 text-warning";
  return "bg-muted text-muted-foreground";
}

export function eventTypeLabel(type: string) {
  return type === "audiencia" ? "Audiência" : type === "prazo" ? "Prazo" : "Tarefa";
}

// eventTypeIcon is defined in AgendaEventModal.tsx (requires JSX)

// ── ICS Export ──
function generateICS(events: CalendarEvent[], dateStr: string): string {
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SIAG//PT","CALSCALE:GREGORIAN"];
  events.forEach((e, i) => {
    const d = dateStr.replace(/-/g,"");
    const t = e.time ? e.time.replace(":","")+"00" : "000000";
    lines.push("BEGIN:VEVENT",`DTSTART:${d}T${t}`,`SUMMARY:${e.title}`,
      `DESCRIPTION:${e.employee || ""}`,`UID:siag-${i}-${d}@siag`,`END:VEVENT`);
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(events: CalendarEvent[], dateStr: string) {
  const blob = new Blob([generateICS(events, dateStr)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `agenda-siag-${dateStr}.ics`;
  a.click(); URL.revokeObjectURL(url);
}
