import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, ShieldAlert, BarChart3, AlertOctagon, Scale } from 'lucide-react';
import type { Administrator, AuditItem } from '@/data/mock-data';

export function AlertsTab({ admins, alerts }: { admins: Administrator[], alerts: AuditItem[] }) {
  const highSeverity = alerts.filter(a => a.severity === 'Alta').length;
  const medSeverity = alerts.filter(a => a.severity === 'Média').length;
  const lowSeverity = alerts.filter(a => a.severity === 'Baixa').length;

  // Compute concentration by comarca
  const totalStateProcesses = admins.reduce((acc, a) => acc + a.activeProcesses, 0);
  const comarcaConcentration = admins.reduce((acc, a) => {
    acc[a.comarca] = (acc[a.comarca] || 0) + a.activeProcesses;
    return acc;
  }, {} as Record<string, number>);

  const concentrationBars = Object.entries(comarcaConcentration)
    .map(([comarca, count]) => ({
      comarca,
      count,
      pct: totalStateProcesses > 0 ? (count / totalStateProcesses) * 100 : 0
    }))
    .sort((a, b) => b.pct - a.pct);

  // Find admins affected by specific normative rules
  const art7Admins = admins.filter(a => a.largeCases >= 3);
  const res393Admins = admins.filter(a => a.activeProcesses > 4 && a.largeCases < 3); // Mutually exclusive for highlight purposes
  const regAdmins = admins.filter(a => a.registrationStatus === 'Vencido');

  return (
    <div className="space-y-6">
      
      {/* Normative Banners */}
      <div className="flex flex-col gap-3">
        {art7Admins.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
            <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-destructive">VEDAÇÃO: Art. 7º Provimento 231/2026 (Limite de Grandes Processos)</h4>
              <p className="text-xs text-destructive/90 mt-0.5 mb-1.5">Acúmulo de 3 ou mais processos de insolvência de grande porte. Proibição absoluta de novas nomeações.</p>
              <div className="flex flex-wrap gap-2">
                {art7Admins.map(a => (
                  <Badge key={a.id} variant="destructive" className="font-mono text-[10px] uppercase">{a.name} ({a.largeCases} RJs)</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {res393Admins.length > 0 && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex items-start gap-3">
            <Scale className="h-5 w-5 text-warning-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-warning-foreground">ATENÇÃO: Art. 5º §3 Resolução 393/2021 (Concentração Geral)</h4>
              <p className="text-xs text-warning-foreground/90 mt-0.5 mb-1.5">Mais de 4 processos de insolvência ativos (RJs ou Falências). Recomendada análise da capacidade operacional.</p>
              <div className="flex flex-wrap gap-2">
                {res393Admins.map(a => (
                  <Badge key={a.id} variant="warning" className="font-mono text-[10px] uppercase">{a.name} ({a.activeProcesses} Ativos)</Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {regAdmins.length > 0 && (
          <div className="bg-brand/10 border border-brand/30 rounded-lg p-3 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-brand">IRREGULARIDADE: Controle Cadastral Anual</h4>
              <p className="text-xs text-brand/90 mt-0.5 mb-1.5">Profissionais com certidões ou registro em órgão de classe vencidos. Sujeito a suspensão imediata do CAJUD.</p>
              <div className="flex flex-wrap gap-2">
                {regAdmins.map(a => (
                  <Badge key={a.id} variant="secondary" className="bg-brand text-brand-foreground border-brand font-mono text-[10px] uppercase hover:bg-brand/80">{a.name}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Riscos Altos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{highSeverity}</div>
            <p className="text-[10px] uppercase tracking-wider text-destructive/80 mt-1">Requerem ação imediata</p>
          </CardContent>
        </Card>
        
        <Card className="bg-warning/10 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-warning-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Riscos Médios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning-foreground">{medSeverity}</div>
            <p className="text-[10px] uppercase tracking-wider text-warning-foreground/80 mt-1">Monitoramento necessário</p>
          </CardContent>
        </Card>
        
        <Card className="bg-info/10 border-info/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-info-foreground flex items-center gap-2">
              <Info className="h-4 w-4" /> Riscos Baixos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info-foreground">{lowSeverity}</div>
            <p className="text-[10px] uppercase tracking-wider text-info-foreground/80 mt-1">Conformidade regular</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Total de Ocorrências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alerts.length}</div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Nos critérios selecionados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" /> Concentração por Comarca
            </CardTitle>
            <CardDescription className="text-xs">Distribuição de nomeações ativas no estado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {concentrationBars.map((item) => (
                <div key={item.comarca} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{item.comarca}</span>
                    <span className="text-muted-foreground">{item.count} proc. ({item.pct.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${item.pct > 30 ? 'bg-destructive' : 'bg-primary'}`} 
                      style={{ width: `${Math.min(100, item.pct)}%` }}
                    />
                  </div>
                  {item.pct > 30 && (
                    <div className="text-[9px] text-destructive uppercase font-semibold">! Atenção - Acima de 30%</div>
                  )}
                </div>
              ))}
              {concentrationBars.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-4">Sem dados para exibição</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Painel de Monitoramento de Conformidade</CardTitle>
            <CardDescription>Eventos sistêmicos consolidados.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-[90px] whitespace-nowrap">Data</TableHead>
                    <TableHead className="text-xs">Administrador</TableHead>
                    <TableHead className="text-xs">Regra Violada / Risco</TableHead>
                    <TableHead className="text-xs">Processos Afetados</TableHead>
                    <TableHead className="text-xs">Ação Recomendada</TableHead>
                    <TableHead className="text-xs text-center w-[100px]">Severidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => {
                    const admin = admins.find(a => a.id === alert.administratorId);
                    return (
                      <TableRow key={alert.id} className={alert.severity === 'Alta' ? 'bg-destructive/5' : ''}>
                        <TableCell className="font-mono text-[10px] whitespace-nowrap">{new Date(alert.factDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-medium text-[11px] min-w-[140px]">{admin?.name || 'Desconhecido'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[11px]">{alert.rule}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{alert.reason}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-muted-foreground min-w-[150px] leading-tight">{alert.cases}</TableCell>
                        <TableCell className="text-[10px] leading-tight">{alert.recommendedAction}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={
                            alert.severity === 'Alta' ? 'destructive' :
                            alert.severity === 'Média' ? 'warning' : 'info'
                          } className="text-[9px] px-1.5 py-0">
                            {alert.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {alerts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                        Nenhum alerta registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
