import { ReactNode, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ClipboardList,
  CalendarDays,
  Scale,
  Bell,
  Menu,
  Plus,
  UserCheck,
  Users,
  LayoutDashboard,
  BarChart3,
  LogOut,
  Building2,
  Shield,
  FileText,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  User,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth, roleLabels, availableMockUsers } from "@/contexts/AuthContext";
import { useAlerts } from "@/contexts/AlertsContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import JuriaChatButton from "@/components/ai/JuriaChatButton";
import InAppNotificationBell from "@/components/notifications/InAppNotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { mockCompanies, mockCases } from "@/data/mock";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ALL_USERS = availableMockUsers.map((u) => u.name);

const allNavItems = [
  { label: "Dashboard", mobileLabel: "Home", icon: LayoutDashboard, path: "/dashboard", external: true, adminOnly: false },
  { label: "Tarefas", mobileLabel: "Tarefas", icon: ClipboardList, path: "/tarefas", external: true, adminOnly: false },
  { label: "Agenda", mobileLabel: "Agenda", icon: CalendarDays, path: "/agenda", external: true, adminOnly: false },
  { label: "Processos", mobileLabel: "Processos", icon: Scale, path: "/processos", external: true, adminOnly: false },
  { label: "Responsáveis", mobileLabel: "Resp.", icon: UserCheck, path: "/responsaveis", external: false, adminOnly: true },
  { label: "Usuários e Permissões", mobileLabel: "Usuários", icon: Users, path: "/usuarios", external: false, adminOnly: true },
  { label: "Relatórios", mobileLabel: "Relatórios", icon: BarChart3, path: "/relatorios", external: false, adminOnly: false },
  { label: "Alertas", mobileLabel: "Alertas", icon: Bell, path: "/alertas", external: true, adminOnly: true },
  { label: "Menu", mobileLabel: "Menu", icon: Menu, path: "/menu", external: false, adminOnly: true },
];

// ─── Formulário de Processo ───────────────────────────────────────────────────
function ProcessoForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [caseNumber, setCaseNumber] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState<"em_andamento" | "encerrado">("em_andamento");
  const [responsible, setResponsible] = useState(user?.name ?? "");
  const [manager, setManager] = useState("nenhum");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNumber || !employeeName || !theme) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    toast({
      title: "✅ Processo criado!",
      description: `Processo ${caseNumber} criado com sucesso.`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        <div className="space-y-2">
          <Label>Número do Processo *</Label>
          <Input
            placeholder="0000000-00.0000.0.00.0000"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Nome do Colaborador *</Label>
          <Input
            placeholder="Nome completo do reclamante"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Empresa / Filial</Label>
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              {mockCompanies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tema *</Label>
          <Textarea
            placeholder="Ex: Horas extras, Rescisão indireta, Assédio moral..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "em_andamento" | "encerrado")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="encerrado">Encerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Responsável (executor)</Label>
          <Select value={responsible} onValueChange={setResponsible}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {ALL_USERS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Gestor responsável</Label>
          <Select value={manager} onValueChange={setManager}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o gestor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhum">Nenhum</SelectItem>
              {ALL_USERS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">O gestor será notificado sobre atualizações deste processo.</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t mt-4">
        <Button type="submit" className="flex-1" style={{ background: "var(--gradient-primary)" }}>
          Criar Processo
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// ─── Formulário de Tarefa ─────────────────────────────────────────────────────
function TarefaForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { addNotification } = useNotificationsContext();

  const [caseSearch, setCaseSearch] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [casePopoverOpen, setCasePopoverOpen] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>(user ? [user.name] : []);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const [manager, setManager] = useState("nenhum");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [priority, setPriority] = useState("media");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCase = selectedCaseId ? mockCases.find((c) => c.id === selectedCaseId) : null;

  const filteredCases = useMemo(() => {
    const q = caseSearch.toLowerCase();
    return mockCases.filter(
      (c) =>
        c.case_number.toLowerCase().includes(q) ||
        c.employee.toLowerCase().includes(q) ||
        c.theme.toLowerCase().includes(q)
    );
  }, [caseSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    return ALL_USERS.filter((u) => u.toLowerCase().includes(q) && !selectedUsers.includes(u));
  }, [userSearch, selectedUsers]);

  const addUser = (name: string) => {
    setSelectedUsers((prev) => [...prev, name]);
    setUserSearch("");
    setUserPopoverOpen(false);
  };

  const removeUser = (name: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (selectedUsers.length === 0) newErrors.users = "Adicione ao menos um responsável.";
    if (!description.trim()) newErrors.description = "Descreva a tarefa.";
    if (!date) newErrors.date = "Selecione uma data.";
    if (!allDay && !time) newErrors.time = "Informe a hora ou marque 'Dia inteiro'.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const caseLabel = selectedCase ? ` · ${selectedCase.case_number}` : "";
    addNotification({
      title: `Tarefa atribuída a você${caseLabel}`,
      description: description.trim().slice(0, 80) + (description.length > 80 ? "…" : ""),
      type: "tarefa",
    });

    toast({
      title: "✅ Tarefa criada!",
      description: `Notificação enviada para ${selectedUsers.join(", ")}${manager && manager !== "nenhum" ? ` e gestor ${manager}` : ""}.`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">

        {/* Processo */}
        <div className="space-y-2">
          <Label>Processo ou caso</Label>
          <Popover open={casePopoverOpen} onOpenChange={setCasePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal h-10", !selectedCase && "text-muted-foreground")}
              >
                <Search className="mr-2 h-4 w-4 shrink-0" />
                {selectedCase
                  ? <span className="truncate">{selectedCase.employee} · {selectedCase.case_number}</span>
                  : "Buscar por colaborador ou nº do processo"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0" align="start">
              <div className="p-3 border-b">
                <Input
                  placeholder="Buscar..."
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                  autoFocus
                  className="h-8 text-sm"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredCases.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">Nenhum processo encontrado</p>
                ) : (
                  filteredCases.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors"
                      onClick={() => { setSelectedCaseId(c.id); setCasePopoverOpen(false); setCaseSearch(""); }}
                    >
                      <p className="text-sm font-medium">{c.employee}</p>
                      <p className="text-xs text-muted-foreground">{c.case_number} · {c.theme}</p>
                    </button>
                  ))
                )}
              </div>
              {selectedCase && (
                <div className="border-t p-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground"
                    onClick={() => { setSelectedCaseId(null); setCasePopoverOpen(false); }}>
                    <X className="h-3 w-3 mr-1" /> Remover vínculo
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {selectedCase && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary flex items-center justify-between gap-2">
              <span className="font-medium truncate">{selectedCase.case_number} · {selectedCase.theme}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => setSelectedCaseId(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Responsáveis */}
        <div className="space-y-2">
          <Label>Responsáveis *</Label>
          <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal h-10 text-muted-foreground", errors.users && "border-destructive")}
              >
                <Users className="mr-2 h-4 w-4" />
                Buscar usuário...
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <div className="p-3 border-b">
                <Input
                  placeholder="Nome do usuário..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  autoFocus
                  className="h-8 text-sm"
                />
              </div>
              <div className="max-h-40 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">Nenhum usuário encontrado</p>
                ) : (
                  filteredUsers.map((u) => (
                    <button
                      key={u}
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                      onClick={() => addUser(u)}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{u[0]}</div>
                      <span className="text-sm">{u}</span>
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          {errors.users && <p className="text-xs text-destructive">{errors.users}</p>}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedUsers.map((u) => (
                <Badge key={u} variant="secondary" className="gap-1 pr-1">
                  <User className="h-3 w-3" />
                  {u}
                  <button type="button" onClick={() => removeUser(u)} className="ml-0.5 rounded-sm hover:bg-destructive/20 p-0.5">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Gestor */}
        <div className="space-y-2">
          <Label>Gestor responsável</Label>
          <Select value={manager} onValueChange={setManager}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o gestor (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhum">Nenhum</SelectItem>
              {ALL_USERS.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label>Tarefa *</Label>
          <Textarea
            placeholder="O que essa pessoa irá fazer?"
            rows={3}
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (e.target.value.trim()) setErrors((p) => ({ ...p, description: "" })); }}
            className={cn(errors.description && "border-destructive")}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        {/* Data / Hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal text-sm", !date && "text-muted-foreground", errors.date && "border-destructive")}
                >
                  <CalendarIcon className="mr-1.5 h-4 w-4" />
                  {date ? format(date, "dd/MM/yy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setDatePopoverOpen(false); setErrors((p) => ({ ...p, date: "" })); }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>
          <div className="space-y-2">
            <Label>Hora {!allDay && "*"}</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => { setTime(e.target.value); setErrors((p) => ({ ...p, time: "" })); }}
              disabled={allDay}
              className={cn(allDay ? "opacity-40" : "", errors.time && "border-destructive")}
            />
            {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
          </div>
        </div>

        {/* Dia inteiro */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allday-sheet"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
          />
          <label htmlFor="allday-sheet" className="text-sm cursor-pointer text-muted-foreground">Dia inteiro</label>
        </div>

        {/* Prioridade */}
        <div className="space-y-2">
          <Label>Prioridade</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedUsers.length > 0 && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
            <p className="font-semibold mb-0.5">📬 Notificações serão enviadas para:</p>
            <p className="text-primary/80">
              {selectedUsers.join(", ")}{manager && manager !== "nenhum" ? ` e gestor ${manager}` : ""}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t mt-4">
        <Button type="submit" className="flex-1" style={{ background: "var(--gradient-primary)" }}>
          Criar Tarefa
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// ─── Botão Criar com Sheet ────────────────────────────────────────────────────
function CreateButton({ className }: { className?: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"processo" | "tarefa" | null>(null);

  const openSheet = (type: "processo" | "tarefa") => {
    setSheetType(type);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setTimeout(() => setSheetType(null), 300);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "gap-2 rounded-xl font-semibold shadow-glow-primary/50 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
              className
            )}
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="h-4 w-4" />
            Criar
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onSelect={() => openSheet("processo")}
          >
            <FileText className="h-4 w-4 text-primary" />
            <span>Criar Processo</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onSelect={() => openSheet("tarefa")}
          >
            <CheckSquare className="h-4 w-4 text-success" />
            <span>Criar Tarefa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                style={{ background: "var(--gradient-primary)" }}
              >
                {sheetType === "processo"
                  ? <FileText className="h-4 w-4 text-primary-foreground" />
                  : <CheckSquare className="h-4 w-4 text-primary-foreground" />
                }
              </div>
              <div>
                <SheetTitle className="text-base">
                  {sheetType === "processo" ? "Novo Processo" : "Nova Tarefa"}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {sheetType === "processo"
                    ? "Preencha os dados do processo trabalhista."
                    : "Preencha os dados e atribua ao responsável."}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden px-6 py-4">
            {sheetType === "processo" && <ProcessoForm onClose={closeSheet} />}
            {sheetType === "tarefa" && <TarefaForm onClose={closeSheet} />}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ─── Layout Principal ─────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, logout, hasRole } = useAuth();
  const { untreatedCount } = useAlerts();

  const isExternal = hasRole(["advogado_externo"]);
  const isAdmin = hasRole(["admin"]);
  const navItems = allNavItems.filter((i) => {
    if (isExternal && !i.external) return false;
    if (i.adminOnly && !isAdmin) return false;
    return true;
  });
  const mobileNavItems = navItems.filter((i) =>
    ["/dashboard", "/tarefas", "/processos", "/alertas", "/menu"].includes(i.path)
  );

  const isActive = (path: string) => location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));

  const initials = user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";

  if (isMobile) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b glass-strong px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Scale className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <h1 className="text-sm font-extrabold tracking-tighter text-foreground">SIAG</h1>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <Badge variant="outline" className="text-[9px] gap-1 font-semibold">
                <Shield className="h-2.5 w-2.5" />
                {roleLabels[user.role]}
              </Badge>
            )}
            <InAppNotificationBell />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={logout}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto pb-[72px]">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t glass-strong safe-area-pb">
          <div className="flex h-[64px] items-center justify-around px-1">
            {mobileNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-all",
                    active ? "text-primary" : "text-muted-foreground active:text-foreground"
                  )}
                >
                  <div className={cn(
                    "relative flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
                    active && "bg-primary/10 scale-110"
                  )}>
                    <item.icon className={cn("h-[18px] w-[18px] transition-all", active && "text-primary")} />
                    {item.path === "/alertas" && untreatedCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-bold text-destructive-foreground shadow-sm">
                        {untreatedCount}
                      </span>
                    )}
                  </div>
                  {item.mobileLabel}
                </Link>
              );
            })}
          </div>
        </nav>
        <JuriaChatButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 flex h-svh w-[240px] flex-col bg-sidebar text-sidebar-foreground">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm" style={{ background: "var(--gradient-primary)" }}>
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tighter">SIAG</h1>
            <p className="text-[10px] font-medium text-sidebar-foreground/50">
              Trabalhista – DP/Jurídico
            </p>
          </div>
        </div>

        {/* Create button */}
        <div className="px-3 pb-3">
          <CreateButton className="w-full h-10" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full" style={{ background: "var(--gradient-primary)" }} />
                )}
                <item.icon className={cn("h-4 w-4 transition-all duration-200", active ? "text-sidebar-primary" : "group-hover:text-sidebar-foreground/80")} />
                <span className="flex-1">{item.label}</span>
                {item.path === "/alertas" && untreatedCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-destructive-foreground shadow-sm" style={{ background: "var(--gradient-danger)" }}>
                    {untreatedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-sidebar-primary-foreground shadow-sm" style={{ background: "var(--gradient-primary)" }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/40 font-medium">
                {user ? roleLabels[user.role] : ""}
              </p>
            </div>
            <InAppNotificationBell />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all" onClick={logout}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
          {user && user.company_id !== "all" && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-sidebar-foreground/40 font-medium">
              <Building2 className="h-3 w-3" />
              {user.company_name}
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">{children}</main>
      <JuriaChatButton />
    </div>
  );
}
