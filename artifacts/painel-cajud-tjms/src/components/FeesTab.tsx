import { MOCK_PAYMENTS, MOCK_ADMINISTRATORS } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { BadgeCheck, Landmark, WalletCards } from 'lucide-react';

function companySizeVariant(size: string) {
  if (size === 'Grande Porte') return 'destructive' as const;
  if (size.startsWith('ME/EPP')) return 'warning' as const;
  if (size.startsWith('Produtor Rural')) return 'success' as const;
  return 'secondary' as const;
}

export function FeesTab({ admins }: { admins: typeof MOCK_ADMINISTRATORS }) {
  const adminIds = new Set(admins.map((admin) => admin.id));
  const payments = MOCK_PAYMENTS.filter((payment) => adminIds.has(payment.administratorId));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              Valores Efetivamente Pagos (Art. 19)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(3150000)}</div>
            <p className="text-xs text-emerald-800/75 mt-1">Total liberado aos administradores via alvará/repasse</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Remuneração Total Homologada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{formatCurrency(11190000)}</div>
            <p className="text-xs text-blue-800/70 mt-1">Aprovado pelo juízo nos processos ativos</p>
          </CardContent>
        </Card>

        <Card className="border-slate-300 bg-slate-100/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <WalletCards className="h-5 w-5" />
              Saldo Remanescente a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(8040000)}</div>
            <p className="text-xs text-slate-600 mt-1">Saldo a quitar ao longo dos planos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">
            Base de Dados de Honorários e Pagamentos (Art. 18 e Art. 19 do Provimento CNJ nº 231/2026)
          </CardTitle>
          <CardDescription className="text-xs">
            Registro eletrônico para monitoramento da remuneração, forma de pagamento e valores efetivamente liberados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs whitespace-nowrap">Processo CNJ</TableHead>
                  <TableHead className="text-xs min-w-[180px]">Administrador Judicial</TableHead>
                  <TableHead className="text-xs min-w-[170px]">Recuperanda / Falida</TableHead>
                  <TableHead className="text-xs whitespace-nowrap">Porte da Empresa</TableHead>
                  <TableHead className="text-xs text-right whitespace-nowrap">Passivo Sujeito (R$)</TableHead>
                  <TableHead className="text-xs text-right whitespace-nowrap">Remuneração Homologada (R$)</TableHead>
                  <TableHead className="text-xs min-w-[190px]">Forma de Pagamento</TableHead>
                  <TableHead className="text-xs text-right whitespace-nowrap">% Efetivo</TableHead>
                  <TableHead className="text-xs text-right whitespace-nowrap">Valores Pagos (R$)</TableHead>
                  <TableHead className="text-xs text-right whitespace-nowrap">Saldo a Pagar (R$)</TableHead>
                  <TableHead className="text-xs text-center whitespace-nowrap">Último Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-[10px] whitespace-nowrap">{payment.processNumber}</TableCell>
                    <TableCell className="text-[11px] font-medium">{payment.administratorName}</TableCell>
                    <TableCell className="text-[11px]">{payment.company}</TableCell>
                    <TableCell>
                      <Badge variant={companySizeVariant(payment.companySize)} className="text-[10px] whitespace-nowrap">
                        {payment.companySize}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px] whitespace-nowrap">{formatCurrency(payment.liabilities)}</TableCell>
                    <TableCell className="text-right font-mono text-[11px] font-semibold whitespace-nowrap">{formatCurrency(payment.referenceFees)}</TableCell>
                    <TableCell className="text-[11px]">{payment.paymentMethod}</TableCell>
                    <TableCell className="text-right text-[11px] font-semibold">{payment.fixedPercentage.toFixed(2)}%</TableCell>
                    <TableCell className="text-right font-mono text-[11px] font-bold text-emerald-600 whitespace-nowrap">{formatCurrency(payment.paid)}</TableCell>
                    <TableCell className="text-right font-mono text-[11px] whitespace-nowrap">{formatCurrency(payment.balance)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground whitespace-nowrap">
                      {payment.lastPayment
                        ? new Date(`${payment.lastPayment}T12:00:00`).toLocaleDateString('pt-BR')
                        : 'Pendente'}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-sm text-muted-foreground h-24">
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
  );
}