import { useState } from 'react';
import { MOCK_PAYMENTS, MOCK_PROCESSES, MOCK_ADMINISTRATORS } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatCompactCurrency } from '@/utils/format';
import { Calculator, DollarSign, ArrowRightLeft, Info, HelpCircle } from 'lucide-react';

export function FeesTab({ admins }: { admins: typeof MOCK_ADMINISTRATORS }) {
  const [calcValue, setCalcValue] = useState<string>('450000000');

  const liabilitiesVal = parseFloat(calcValue.replace(/[^\d.-]/g, '')) || 0;
  
  // Calculate CNJ 231/2026 progressive bands
  const calculateCNJ = (val: number) => {
    let rem = val;
    const bands = [];
    
    // band 1: up to 300M, 2.5%
    let band1 = Math.min(rem, 300_000_000);
    if(band1 > 0) bands.push({ label: 'Até R$ 300M', rate: 2.5, val: band1, fee: band1 * 0.025 });
    rem -= band1;
    
    // band 2: 300M - 500M (200M width), 1%
    let band2 = Math.min(Math.max(rem, 0), 200_000_000);
    if(band2 > 0) bands.push({ label: 'De R$ 300M a 500M', rate: 1.0, val: band2, fee: band2 * 0.01 });
    rem -= band2;

    // band 3: 500M - 1B (500M width), 0.5%
    let band3 = Math.min(Math.max(rem, 0), 500_000_000);
    if(band3 > 0) bands.push({ label: 'De R$ 500M a 1B', rate: 0.5, val: band3, fee: band3 * 0.005 });
    rem -= band3;

    // band 4: 1B - 3B (2B width), 0.1%
    let band4 = Math.min(Math.max(rem, 0), 2_000_000_000);
    if(band4 > 0) bands.push({ label: 'De R$ 1B a 3B', rate: 0.1, val: band4, fee: band4 * 0.001 });
    rem -= band4;

    // band 5: 3B - 10B (7B width), 0.01%
    let band5 = Math.min(Math.max(rem, 0), 7_000_000_000);
    if(band5 > 0) bands.push({ label: 'De R$ 3B a 10B', rate: 0.01, val: band5, fee: band5 * 0.0001 });
    rem -= band5;

    // band 6: > 10B, 0.001%
    let band6 = Math.max(rem, 0);
    if(band6 > 0) bands.push({ label: 'Acima de R$ 10B', rate: 0.001, val: band6, fee: band6 * 0.00001 });

    const total = bands.reduce((acc, b) => acc + b.fee, 0);
    const effectiveRate = val > 0 ? (total / val) * 100 : 0;
    
    return { bands, total, effectiveRate };
  };

  const { bands: calcBands, total: calcTotal, effectiveRate: calcEffectiveRate } = calculateCNJ(liabilitiesVal);

  // Filter payments
  const adminIds = new Set(admins.map(a => a.id));
  const payments = MOCK_PAYMENTS.filter(p => adminIds.has(p.administratorId));

  const totalApproved = payments.reduce((acc, p) => acc + p.referenceFees, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.paid, 0);
  const totalBalance = payments.reduce((acc, p) => acc + p.balance, 0);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Honorários Arbitrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalApproved)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total aprovado em juízo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-success" /> Valores Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">Liberados aos profissionais</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-warning-foreground" /> Saldo Remanescente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">A pagar conforme fluxo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4 text-primary" />
              Calculadora Anexo I - CNJ 231/2026
            </CardTitle>
            <CardDescription className="text-xs">Tabela marginal progressiva para grandes devedores.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Passivo / Valor de Referência (R$)</label>
              <Input 
                type="number" 
                value={calcValue} 
                onChange={(e) => setCalcValue(e.target.value)} 
                className="font-mono text-sm h-8"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 pb-2 border-b">
              <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => setCalcValue('450000000')}>Ex: 450M</Button>
              <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => setCalcValue('1200000000')}>Ex: 1.2B</Button>
              <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => setCalcValue('5000000000')}>Ex: 5B</Button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Composição da Faixa</div>
              {calcBands.length > 0 ? (
                <div className="text-xs space-y-1">
                  {calcBands.map((band, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{band.label} <span className="font-semibold text-foreground">({band.rate}%)</span></span>
                      <span className="font-mono">{formatCompactCurrency(band.fee)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">Insira um valor válido.</div>
              )}
            </div>

            <div className="pt-2 bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Referencial CNJ (Máximo)</div>
                  <div className="text-xl font-bold text-brand">{formatCurrency(calcTotal)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Taxa Efetiva</div>
                  <div className="text-sm font-bold">{calcEffectiveRate.toFixed(4)}%</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4 text-[10px] text-muted-foreground bg-blue-50/50 p-2 rounded border border-blue-100">
              <Info className="h-3 w-3 text-blue-500 shrink-0 mt-0.5" />
              <p>Normativa aplicável (Art. 15 §4): A remuneração fixada observará as faixas regressivas do Anexo I, não impedindo a majoração excepcional por decisão fundamentada.</p>
            </div>
            
          </CardContent>
        </Card>

        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Acompanhamento de Remunerações e Pagamentos</CardTitle>
            <CardDescription className="text-xs">Destaque para processos com % fixado acima da taxa efetiva CNJ.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs whitespace-nowrap">Processo CNJ</TableHead>
                    <TableHead className="text-xs">Recuperanda / Falida</TableHead>
                    <TableHead className="text-xs">Administrador</TableHead>
                    <TableHead className="text-xs text-right">Passivo</TableHead>
                    <TableHead className="text-xs text-right whitespace-nowrap">Homologado (R$)</TableHead>
                    <TableHead className="text-xs text-right whitespace-nowrap">% Fixo</TableHead>
                    <TableHead className="text-xs text-right whitespace-nowrap">Teto Efetivo CNJ</TableHead>
                    <TableHead className="text-xs text-right">Pago</TableHead>
                    <TableHead className="text-xs text-right">Saldo</TableHead>
                    <TableHead className="text-xs text-center whitespace-nowrap">Últ. Pgto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => {
                    const proc = MOCK_PROCESSES.find(pr => pr.id === p.processId);
                    const admin = MOCK_ADMINISTRATORS.find(a => a.id === p.administratorId);
                    const liabilities = proc?.liabilities || 0;
                    
                    // Calc max effective rate for this process' liabilities based on CNJ tables
                    const calc = calculateCNJ(liabilities);
                    const isExceeding = p.fixedPercentage > calc.effectiveRate;

                    return (
                      <TableRow key={p.id} className={isExceeding ? 'bg-warning/5' : ''}>
                        <TableCell className="font-mono text-[10px] whitespace-nowrap">{proc?.cnjNumber}</TableCell>
                        <TableCell className="font-medium text-[11px] truncate max-w-[120px]">{proc?.company}</TableCell>
                        <TableCell className="text-[11px] truncate max-w-[120px]">{admin?.name}</TableCell>
                        <TableCell className="text-right font-mono text-[11px]">{formatCompactCurrency(liabilities)}</TableCell>
                        <TableCell className="text-right font-mono text-[11px] font-semibold">{formatCompactCurrency(p.referenceFees)}</TableCell>
                        <TableCell className={`text-right text-[11px] font-bold ${isExceeding ? 'text-destructive' : ''}`}>{p.fixedPercentage}%</TableCell>
                        <TableCell className="text-right text-[11px] text-muted-foreground">{calc.effectiveRate.toFixed(4)}%</TableCell>
                        <TableCell className="text-right font-mono text-[11px] text-success">{formatCompactCurrency(p.paid)}</TableCell>
                        <TableCell className="text-right font-mono text-[11px] text-warning-foreground">{formatCompactCurrency(p.balance)}</TableCell>
                        <TableCell className="text-center text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(p.lastPayment).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-sm text-muted-foreground h-24">
                        Nenhum pagamento mapeado para os filtros selecionados.
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
