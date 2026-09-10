import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_ADMINISTRATORS, MOCK_PROCESSES } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatCompactCurrency } from '@/utils/format';
import { Building2, Users, AlertTriangle, Scale, BadgeCheck, FileText, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import type { Administrator } from '@/data/mock-data';

export function OverviewTab({ admins, isUnfiltered }: { admins: typeof MOCK_ADMINISTRATORS, isUnfiltered: boolean }) {
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // KPIs
  // When unfiltered, we enforce the specific brief requirements. Otherwise calculate.
  const totalAdminsDisplay = isUnfiltered ? 48 : admins.length;
  const totalAdminsLabel = isUnfiltered ? '38 PF / 10 PJ' : '';
  const totalProcessesDisplay = isUnfiltered ? 82 : admins.reduce((acc, curr) => acc + curr.activeProcesses, 0);
  const totalProcessesLabel = isUnfiltered ? '54 RJs / 28 Falências' : '';
  const largeCasesCountDisplay = isUnfiltered ? 11 : MOCK_PROCESSES.filter(p => new Set(admins.map(a => a.id)).has(p.administratorId) && p.liabilities > 300000000).length;
  const totalLiabilitiesDisplay = isUnfiltered ? 4820650000 : admins.reduce((acc, curr) => acc + curr.liabilities, 0);
  const adminsWithAlertsDisplay = isUnfiltered ? 3 : admins.filter(a => a.cnjAlert).length;
  const avgProcessesDisplay = isUnfiltered ? '2.4' : (admins.filter(a => a.registrationStatus === 'Ativo').length > 0 ? (totalProcessesDisplay / admins.filter(a => a.registrationStatus === 'Ativo').length).toFixed(1) : '0');

  // Charts Data
  const topAdmins = useMemo(() => {
    return [...admins].sort((a,b) => b.activeProcesses - a.activeProcesses).slice(0, 8);
  }, [admins]);

  const mapSpecialtyCategory = (admin: Administrator) => {
    if (admin.personType === 'PJ') return 'Soc. Especializadas PJ';
    const s = admin.specialty.toLowerCase();
    if (s.includes('direito')) return 'Direito';
    if (s.includes('contáb') || s.includes('finança') || s.includes('contabilidade')) return 'Contabilidade';
    if (s.includes('economia')) return 'Economia';
    return 'Administração';
  };

  const specialtyData = useMemo(() => {
    if (isUnfiltered) {
      return [
        { name: 'Direito', value: 42 },
        { name: 'Contabilidade', value: 25 },
        { name: 'Administração', value: 17 },
        { name: 'Soc. Especializadas PJ', value: 12 },
        { name: 'Economia', value: 4 },
      ];
    }
    const counts = admins.reduce((acc, a) => {
      const cat = mapSpecialtyCategory(a);
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [admins, isUnfiltered]);
  
  const COLORS = ['#ea580c', '#0f172a', '#3b82f6', '#10b981', '#8b5cf6'];

  const selectedAdmin = useMemo(() => admins.find(a => a.id === selectedAdminId) || null, [admins, selectedAdminId]);
  const selectedAdminProcesses = useMemo(() => MOCK_PROCESSES.filter(p => p.administratorId === selectedAdminId), [selectedAdminId]);

  useEffect(() => {
    if (selectedAdminId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedAdminId]);

  return (
    <div className="space-y-6">
      {/* 6 KPIs row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="relative overflow-hidden">
          {isUnfiltered && <div className="absolute top-0 right-0 bg-muted text-[8px] px-1 text-muted-foreground">Base</div>}
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <Users className="h-5 w-5 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">{totalAdminsDisplay}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Total Cadastrados</p>
            {totalAdminsLabel && <p className="text-[9px] text-muted-foreground/70">{totalAdminsLabel}</p>}
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          {isUnfiltered && <div className="absolute top-0 right-0 bg-muted text-[8px] px-1 text-muted-foreground">Base</div>}
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <Scale className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-bold text-primary">{totalProcessesDisplay}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Processos de Insolvência</p>
            {totalProcessesLabel && <p className="text-[9px] text-muted-foreground/70">{totalProcessesLabel}</p>}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          {isUnfiltered && <div className="absolute top-0 right-0 bg-muted text-[8px] px-1 text-muted-foreground">Base</div>}
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <Building2 className="h-5 w-5 text-brand mb-2" />
            <div className="text-2xl font-bold text-brand">{largeCasesCountDisplay}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">RJs Grande Porte</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          {isUnfiltered && <div className="absolute top-0 right-0 bg-muted text-[8px] px-1 text-muted-foreground">Base</div>}
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <BadgeCheck className="h-5 w-5 text-success mb-2" />
            <div className="text-2xl font-bold text-success">{formatCompactCurrency(totalLiabilitiesDisplay)}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Passivo Sob Gestão</p>
          </CardContent>
        </Card>

        <Card className={`relative overflow-hidden ${adminsWithAlertsDisplay > 0 ? "border-destructive/50 bg-destructive/5" : ""}`}>
          {isUnfiltered && <div className="absolute top-0 right-0 bg-muted text-[8px] px-1 text-muted-foreground">Base</div>}
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <AlertTriangle className={`h-5 w-5 mb-2 ${adminsWithAlertsDisplay > 0 ? "text-destructive" : "text-muted-foreground"}`} />
            <div className={`text-2xl font-bold ${adminsWithAlertsDisplay > 0 ? "text-destructive" : ""}`}>{adminsWithAlertsDisplay}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Admins em Alerta CNJ</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          {isUnfiltered && <div className="absolute top-0 right-0 bg-muted text-[8px] px-1 text-muted-foreground">Base</div>}
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <Activity className="h-5 w-5 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">{avgProcessesDisplay}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Média Processos/AJ</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Concentração de Processos Ativos por Administrador Judicial</CardTitle>
            <CardDescription>Linha de referência em 4 processos. Destaca possíveis pontos de atenção (Res 393/Art. 5º).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topAdmins}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={160} tick={{fontSize: 11}} />
                  <RechartsTooltip />
                  <ReferenceLine x={4} stroke="#ea580c" strokeDasharray="3 3" label={{ position: 'top', value: 'Limite Recomendado (4)', fill: '#ea580c', fontSize: 10 }} />
                  <Bar dataKey="activeProcesses" radius={[0, 4, 4, 0]}>
                    {topAdmins.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.activeProcesses >= 4 ? '#ea580c' : '#0f172a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distribuição por Especialidade</CardTitle>
            <CardDescription>Agrupamento principal de atuação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex flex-col">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={specialtyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {specialtyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 overflow-y-auto pr-2 mt-2">
                <div className="grid grid-cols-1 gap-x-2 gap-y-1 text-xs">
                  {specialtyData.map((spec, idx) => (
                    <div key={spec.name} className="flex justify-between items-center gap-1.5 overflow-hidden border-b border-border/50 pb-1">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="truncate text-muted-foreground">{spec.name}</span>
                      </div>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quadro Geral de Administradores</CardTitle>
          <CardDescription>Selecione um profissional para detalhar nomeações e perfil.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Administrador / Sociedade</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Status CPTEC</TableHead>
                <TableHead className="text-right whitespace-nowrap">Proc. Ativos</TableHead>
                <TableHead className="text-right whitespace-nowrap">RJs &gt;300M</TableHead>
                <TableHead className="text-right whitespace-nowrap">Passivo Total</TableHead>
                <TableHead className="text-right whitespace-nowrap">Hon. Homologados</TableHead>
                <TableHead className="text-center">Alerta CNJ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => {
                return (
                  <TableRow 
                    key={admin.id}
                    className={`cursor-pointer transition-colors ${selectedAdminId === admin.id ? 'bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted/50 border-l-2 border-l-transparent'}`}
                    onClick={() => setSelectedAdminId(admin.id)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{admin.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2">
                          {admin.name}
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{admin.personType}</Badge>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{admin.classRegistration}</TableCell>
                    <TableCell>
                      <Badge variant={
                        admin.registrationStatus === 'Ativo' ? 'success' : 
                        admin.registrationStatus === 'Suspenso' ? 'warning' : 'destructive'
                      }>
                        {admin.registrationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{admin.activeProcesses}</TableCell>
                    <TableCell className="text-right text-brand font-medium">{admin.largeCases}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatCompactCurrency(admin.liabilities)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatCompactCurrency(admin.approvedFees)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={
                        admin.alertText === 'Regular' ? 'success' :
                        admin.alertText?.includes('VEDADO') || admin.alertText?.includes('Vencido') ? 'destructive' : 'warning'
                      }>
                        {admin.alertText || 'Regular'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {admins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Nenhum administrador encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Synchronized Detail Cards */}
      {selectedAdmin && (
        <div ref={detailRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="col-span-1 border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> Perfil e Capacidade Técnica
              </CardTitle>
              <CardDescription>{selectedAdmin.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">CPF/CNPJ</div>
                  <div className="font-mono text-xs">{selectedAdmin.cpfCnpjMasked}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Validade do Registro</div>
                  <div className="font-medium text-xs">{new Date(selectedAdmin.registrationExpiry).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Tamanho da Equipe</div>
                  <div className="font-medium text-xs">{selectedAdmin.teamSize} profissionais</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Capacidade Teto</div>
                  <div className="font-medium text-xs">{selectedAdmin.capacity} processos</div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-3">
                <div className="text-xs text-muted-foreground mb-2">Situação das Certidões</div>
                <div className="space-y-1.5">
                  {['Órgão de Classe', 'Tributária Federal', 'Cível Estadual', 'Criminal Estadual'].map(certName => {
                    const hasCert = selectedAdmin.certificates.includes(certName);
                    return (
                      <div key={certName} className="flex items-center justify-between text-xs">
                        <span>{certName}</span>
                        <Badge variant={hasCert ? "success" : "destructive"} className="text-[9px] h-4 px-1.5 py-0 font-normal">
                          {hasCert ? "OK" : "Pendente"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2 shadow-md flex flex-col">
            <CardHeader className="pb-4 border-b shrink-0">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Relação de Processos e Nomeações Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="max-h-[350px] overflow-auto">
                <Table>
                  <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="text-[10px] whitespace-nowrap">Número CNJ</TableHead>
                      <TableHead className="text-[10px] whitespace-nowrap">Vara e Juiz</TableHead>
                      <TableHead className="text-[10px] whitespace-nowrap">Tipo/Status</TableHead>
                      <TableHead className="text-[10px] text-right whitespace-nowrap">Passivo (R$)</TableHead>
                      <TableHead className="text-[10px] text-right whitespace-nowrap">Hon. Homologados</TableHead>
                      <TableHead className="text-[10px] text-right whitespace-nowrap">Hon. Pagos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAdminProcesses.map(proc => (
                      <TableRow key={proc.id}>
                        <TableCell className="font-mono text-[10px] whitespace-nowrap">
                          {proc.cnjNumber}
                          <div className="text-muted-foreground font-sans font-medium mt-0.5 truncate max-w-[140px]" title={proc.company}>{proc.company}</div>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground">
                          {proc.comarcaCourt}
                          <div className="mt-0.5 text-foreground">{proc.appointingJudge}</div>
                        </TableCell>
                        <TableCell className="text-[10px]">
                          <Badge variant="outline" className="text-[9px] h-4 px-1">{proc.actionType}</Badge>
                          <div className={`mt-0.5 font-medium ${proc.status === 'Ativo' ? 'text-success' : 'text-muted-foreground'}`}>{proc.status}</div>
                        </TableCell>
                        <TableCell className="text-[10px] text-right font-mono font-medium">
                          {formatCompactCurrency(proc.liabilities)}
                        </TableCell>
                        <TableCell className="text-[10px] text-right font-mono">
                          {formatCompactCurrency(proc.approvedFees)}
                        </TableCell>
                        <TableCell className="text-[10px] text-right font-mono text-success">
                          {formatCompactCurrency(proc.paidFees)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedAdminProcesses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground h-24">
                          Nenhum processo mapeado nesta base de dados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
