import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OverviewTab } from '@/components/OverviewTab';
import { AlertsTab } from '@/components/AlertsTab';
import { FeesTab } from '@/components/FeesTab';
import { Filter, RefreshCcw, Search, BarChart3, BellRing, DollarSign, ExternalLink } from 'lucide-react';
import { MOCK_ADMINISTRATORS, MOCK_AUDIT_ITEMS, MOCK_PAYMENTS, MOCK_PROCESSES } from '@/data/mock-data';
import { exportToCsv } from '@/utils/format';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Global Filters
  const [filters, setFilters] = useState({
    specialty: 'Todas',
    comarca: 'Todas',
    status: 'Todos',
    alertStatus: 'Todos',
    largeCase: 'Todos',
    search: '',
  });

  const handleResetFilters = () => {
    setFilters({ 
      specialty: 'Todas',
      comarca: 'Todas', 
      status: 'Todos', 
      alertStatus: 'Todos',
      largeCase: 'Todos',
      search: '' 
    });
  };

  const filteredAdmins = useMemo(() => {
    return MOCK_ADMINISTRATORS.filter(a => {
      if (filters.specialty !== 'Todas' && a.specialty !== filters.specialty) return false;
      if (filters.comarca !== 'Todas' && a.comarca !== filters.comarca) return false;
      if (filters.status !== 'Todos' && a.registrationStatus !== filters.status) return false;
      if (filters.alertStatus === 'Com Alerta' && !a.cnjAlert) return false;
      if (filters.alertStatus === 'Sem Alerta' && a.cnjAlert) return false;
      
      const adminLgCases = MOCK_PROCESSES.filter(p => p.administratorId === a.id && p.liabilities > 300000000).length;
      if (filters.largeCase === 'Sim' && adminLgCases === 0) return false;
      if (filters.largeCase === 'Não' && adminLgCases > 0) return false;
      
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!a.name.toLowerCase().includes(s) && !a.cpfCnpjMasked.includes(s)) return false;
      }
      return true;
    });
  }, [filters]);

  const filteredAlerts = useMemo(() => {
    const adminIds = new Set(filteredAdmins.map(a => a.id));
    return MOCK_AUDIT_ITEMS.filter(alert => adminIds.has(alert.administratorId));
  }, [filteredAdmins]);

  const isUnfiltered = Object.values(filters).every((value) =>
    value === '' || value === 'Todas' || value === 'Todos'
  );

  const handleExportCSV = () => {
    if (activeTab === 'overview') {
      const data = filteredAdmins.map(a => ({
        ID: a.id,
        Nome: a.name,
        'Tipo Pessoa': a.personType,
        Especialidade: a.specialty,
        Comarca: a.comarca,
        Registro: a.classRegistration,
        'Status CAJUD': a.registrationStatus,
        'Processos Ativos': a.activeProcesses,
        'RJs Grande Porte': MOCK_PROCESSES.filter(p => p.administratorId === a.id && p.liabilities > 300000000).length,
        'Passivo Total': a.liabilities,
        'Alerta CNJ': a.cnjAlert ? 'Sim' : 'Não',
        'Vencimento Registro': a.registrationExpiry
      }));
      exportToCsv('cptec_administradores.csv', data);
    } else if (activeTab === 'alerts') {
      const data = filteredAlerts.map(al => {
        const admin = filteredAdmins.find(a => a.id === al.administratorId);
        return {
          Data: new Date(al.factDate).toLocaleDateString('pt-BR'),
          Administrador: admin?.name || '',
          'Regra Violada': al.rule,
          Motivo: al.reason,
          Processos: al.cases,
          Severidade: al.severity,
          Recomendacao: al.recommendedAction
        };
      });
      exportToCsv('cptec_alertas.csv', data);
    } else if (activeTab === 'fees') {
      const adminIds = new Set(filteredAdmins.map(a => a.id));
      const payments = MOCK_PAYMENTS.filter(p => adminIds.has(p.administratorId));
      const data = payments.map(p => {
        return {
          'Processo CNJ': p.processNumber,
          'Administrador Judicial': p.administratorName,
          'Recuperanda / Falida': p.company,
          'Porte da Empresa': p.companySize,
          'Passivo Sujeito': p.liabilities,
          'Honorarios Homologados': p.referenceFees,
          'Forma de Pagamento': p.paymentMethod,
          '% Efetivo': p.fixedPercentage,
          'Valores Pagos': p.paid,
          'Saldo a Pagar': p.balance,
          'Ultimo Pagamento': p.lastPayment ?? 'Pendente'
        };
      });
      exportToCsv('cajud_honorarios_pagamentos.csv', data);
    }
  };

  const getAssetUrl = (path: string) => {
    const base = import.meta.env.BASE_URL || '/';
    return `${base}${path}`.replace(/\/\//g, '/');
  };

  const uniqueSpecialties = Array.from(new Set(MOCK_ADMINISTRATORS.map(a => a.specialty))).sort();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* TJMS Header */}
      <header className="bg-tjms-navy border-b border-tjms-navy/90 text-white shadow-md relative z-10">
        <div className="container mx-auto px-4 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-auto flex items-center justify-center bg-white/5 rounded p-1">
              <img src={getAssetUrl('logo-tjms.png')} alt="TJMS Logo" className="h-10 object-contain mix-blend-screen opacity-90" />
            </div>
            <div className="hidden md:block">
              <h2 className="text-[10px] text-white/60 uppercase tracking-[0.2em] mb-0.5 font-semibold">Poder Judiciário • Tribunal de Justiça de Mato Grosso do Sul</h2>
              <h1 className="text-lg font-bold tracking-tight leading-none">SISTEMA DOS AUXILIARES DA JUSTIÇA</h1>
              <p className="text-xs text-white/70 mt-1">Módulo CAJUD (Administradores Judiciais) • Provimento CNJ nº 231/2026 e Res. CNJ nº 393/2021</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-white/50 hidden lg:block text-right tracking-wider uppercase">
              <div>Desenvolvido pela CBI</div>
              <div>Atualizado: {new Date().toLocaleDateString('pt-BR')} 08:30</div>
            </div>
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            <div className="h-10 w-auto flex flex-col justify-center">
              <img src={getAssetUrl('logo-cbi.png')} alt="CBI Logo" className="h-full object-contain mix-blend-screen opacity-90" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-5">
        
        {/* Top Actions & Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
            <TabsList className="bg-white border shadow-sm p-1 rounded-md h-auto">
              <TabsTrigger 
                value="overview" 
                className="py-2 px-4 text-sm gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                Visão Geral & Concentração
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="py-2 px-4 text-sm gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                <BellRing className="w-4 h-4" />
                Monitoramento & Alertas CNJ
              </TabsTrigger>
              <TabsTrigger 
                value="fees" 
                className="py-2 px-4 text-sm gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                <DollarSign className="w-4 h-4" />
                Honorários & Remunerações
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" className="shrink-0 gap-2 bg-white" onClick={handleExportCSV}>
            <ExternalLink className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>

        {/* Global Filters Panel */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground whitespace-nowrap mb-3 border-b pb-2">
            <Filter className="w-4 h-4" /> Filtros Globais
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
            
            <div className="w-full">
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block uppercase tracking-wider">Especialidade</label>
              <Select value={filters.specialty} onValueChange={(val) => setFilters({...filters, specialty: val})}>
                <SelectTrigger className="bg-white h-8 text-xs">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {uniqueSpecialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block uppercase tracking-wider">Comarca</label>
              <Select value={filters.comarca} onValueChange={(val) => setFilters({...filters, comarca: val})}>
                <SelectTrigger className="bg-white h-8 text-xs">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Campo Grande">Campo Grande</SelectItem>
                  <SelectItem value="Dourados">Dourados</SelectItem>
                  <SelectItem value="Três Lagoas">Três Lagoas</SelectItem>
                  <SelectItem value="Corumbá">Corumbá</SelectItem>
                  <SelectItem value="Ponta Porã">Ponta Porã</SelectItem>
                  <SelectItem value="Naviraí">Naviraí</SelectItem>
                  <SelectItem value="Aquidauana">Aquidauana</SelectItem>
                  <SelectItem value="Nova Andradina">Nova Andradina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block uppercase tracking-wider">Situação Cadastral</label>
              <Select value={filters.status} onValueChange={(val) => setFilters({...filters, status: val})}>
                <SelectTrigger className="bg-white h-8 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Suspenso">Suspenso</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block uppercase tracking-wider">Alerta CNJ</label>
              <Select value={filters.alertStatus} onValueChange={(val) => setFilters({...filters, alertStatus: val})}>
                <SelectTrigger className="bg-white h-8 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Com Alerta">Com Alerta</SelectItem>
                  <SelectItem value="Sem Alerta">Sem Alerta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block uppercase tracking-wider whitespace-nowrap">Grande Porte (&gt;300M)</label>
              <Select value={filters.largeCase} onValueChange={(val) => setFilters({...filters, largeCase: val})}>
                <SelectTrigger className="bg-white h-8 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full relative col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block uppercase tracking-wider">Busca</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Nome ou CPF/CNPJ..." 
                  className="pl-8 bg-white h-8 text-xs"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>

            <Button variant="ghost" onClick={handleResetFilters} className="h-8 gap-2 text-xs text-muted-foreground hover:text-foreground shrink-0 col-span-1">
              <RefreshCcw className="w-3.5 h-3.5" /> Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-2">
          {activeTab === 'overview' && <OverviewTab admins={filteredAdmins} isUnfiltered={isUnfiltered} />}
          {activeTab === 'alerts' && <AlertsTab admins={filteredAdmins} alerts={filteredAlerts} />}
          {activeTab === 'fees' && <FeesTab admins={filteredAdmins} />}
        </div>
        
      </main>
    </div>
  );
}
