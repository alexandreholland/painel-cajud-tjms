export type PersonType = 'PF' | 'PJ';
export type RegistrationStatus = 'Ativo' | 'Inativo' | 'Vencido' | 'Suspenso';
export type ProcessStatus = 'Ativo' | 'Encerrado' | 'Suspenso';

export interface Administrator {
  id: string;
  name: string;
  personType: PersonType;
  specialty: string;
  comarca: string;
  classRegistration: string;
  registrationStatus: RegistrationStatus;
  activeProcesses: number;
  largeCases: number;
  liabilities: number;
  approvedFees: number;
  paidFees: number;
  cnjAlert: boolean;
  alertText?: string;
  cpfCnpjMasked: string;
  technicalLead?: string;
  registrationExpiry: string;
  certificates: string[];
  capacity: number;
  teamSize: number;
}

export interface Process {
  id: string;
  cnjNumber: string;
  company: string;
  actionType: string;
  comarcaCourt: string;
  appointingJudge: string;
  administratorId: string;
  liabilities: number;
  isLarge: boolean;
  approvedFees: number;
  paidFees: number;
  status: ProcessStatus;
  appointmentDate: string;
}

export interface AuditItem {
  id: string;
  administratorId: string;
  rule: string;
  reason: string;
  cases: string;
  factDate: string;
  recommendedAction: string;
  severity: 'Alta' | 'Média' | 'Baixa';
}

export interface Payment {
  id: string;
  processId: string;
  administratorId: string;
  fixedPercentage: number;
  referenceFees: number;
  paid: number;
  balance: number;
  lastPayment: string;
}

export const MOCK_ADMINISTRATORS: Administrator[] = [
  {
    id: 'a1',
    name: 'Silva & Silva Administração Judicial Ltda',
    personType: 'PJ',
    specialty: 'Gestão Empresarial',
    comarca: 'Campo Grande',
    classRegistration: 'CRA-MS 12345/J',
    registrationStatus: 'Ativo',
    activeProcesses: 3,
    largeCases: 3,
    liabilities: 1450000000.00,
    approvedFees: 21500000.00,
    paidFees: 4500000.00,
    cnjAlert: true,
    alertText: 'VEDADO (Art. 7º)',
    cpfCnpjMasked: '12.***.***/0001-99',
    technicalLead: 'João Silva',
    registrationExpiry: '2024-12-31',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Órgão de Classe'],
    capacity: 25,
    teamSize: 12,
  },
  {
    id: 'a2',
    name: 'Dr. Roberto Medeiros',
    personType: 'PF',
    specialty: 'Direito Societário',
    comarca: 'Dourados',
    classRegistration: 'OAB-MS 8765',
    registrationStatus: 'Ativo',
    activeProcesses: 3,
    largeCases: 2, 
    liabilities: 835000000.00,
    approvedFees: 12500000.00,
    paidFees: 2100000.00,
    cnjAlert: true,
    alertText: 'Atenção (2)',
    cpfCnpjMasked: '***.456.789-**',
    registrationExpiry: '2025-05-15',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 10,
    teamSize: 3,
  },
  {
    id: 'a3',
    name: 'Dra. Carolina Castro e Lima',
    personType: 'PF',
    specialty: 'Contabilidade e Finanças',
    comarca: 'Três Lagoas',
    classRegistration: 'CRC-MS 4321',
    registrationStatus: 'Ativo',
    activeProcesses: 5, 
    largeCases: 0,
    liabilities: 45000000.00,
    approvedFees: 1800000.00,
    paidFees: 1200000.00,
    cnjAlert: true,
    alertText: 'Excesso (>4 Falências)',
    cpfCnpjMasked: '***.123.456-**',
    registrationExpiry: '2025-02-28',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 8,
    teamSize: 2,
  },
  {
    id: 'a4',
    name: 'Gestão Empresarial Pantanal Ltda',
    personType: 'PJ',
    specialty: 'Reestruturação',
    comarca: 'Corumbá',
    classRegistration: 'CRA-MS 99887/J',
    registrationStatus: 'Vencido', 
    activeProcesses: 1,
    largeCases: 1,
    liabilities: 120000000.00,
    approvedFees: 3600000.00,
    paidFees: 3000000.00,
    cnjAlert: true,
    alertText: 'Cadastro Vencido',
    cpfCnpjMasked: '45.***.***/0001-11',
    technicalLead: 'Mariana Costa',
    registrationExpiry: '2023-10-15',
    certificates: ['Cível Estadual'],
    capacity: 15,
    teamSize: 5,
  },
  {
    id: 'a5',
    name: 'Pereira & Associados Consultoria',
    personType: 'PJ',
    specialty: 'Auditoria Contábil',
    comarca: 'Campo Grande',
    classRegistration: 'CRC-MS 5566/J',
    registrationStatus: 'Ativo',
    activeProcesses: 2,
    largeCases: 1,
    liabilities: 95000000.00,
    approvedFees: 2400000.00,
    paidFees: 1100000.00,
    cnjAlert: false,
    alertText: 'Regular',
    cpfCnpjMasked: '08.***.***/0001-22',
    technicalLead: 'Carlos Pereira',
    registrationExpiry: '2025-08-10',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 20,
    teamSize: 8,
  },
  {
    id: 'a6',
    name: 'Dr. Fernando Souza',
    personType: 'PF',
    specialty: 'Direito Empresarial',
    comarca: 'Ponta Porã',
    classRegistration: 'OAB-MS 1122',
    registrationStatus: 'Ativo',
    activeProcesses: 1,
    largeCases: 0,
    liabilities: 18000000.00,
    approvedFees: 850000.00,
    paidFees: 500000.00,
    cnjAlert: false,
    alertText: 'Regular',
    cpfCnpjMasked: '***.888.999-**',
    registrationExpiry: '2024-11-20',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 8,
    teamSize: 1,
  },
  {
    id: 'a7',
    name: 'Dra. Amanda Rodrigues',
    personType: 'PF',
    specialty: 'Economia',
    comarca: 'Naviraí',
    classRegistration: 'CORE-MS 3344',
    registrationStatus: 'Inativo',
    activeProcesses: 0,
    largeCases: 0,
    liabilities: 0,
    approvedFees: 0,
    paidFees: 0,
    cnjAlert: false,
    alertText: 'Regular',
    cpfCnpjMasked: '***.777.666-**',
    registrationExpiry: '2022-05-10',
    certificates: [],
    capacity: 5,
    teamSize: 1,
  },
  {
    id: 'a8',
    name: 'Líder Assessoria Judicial',
    personType: 'PJ',
    specialty: 'Administração',
    comarca: 'Campo Grande',
    classRegistration: 'CRA-MS 4455/J',
    registrationStatus: 'Ativo',
    activeProcesses: 2,
    largeCases: 4,
    liabilities: 1100000000.00,
    approvedFees: 18500000.00,
    paidFees: 9000000.00,
    cnjAlert: true,
    alertText: 'Concentração (>30%)',
    cpfCnpjMasked: '18.***.***/0001-33',
    technicalLead: 'Ricardo Alves',
    registrationExpiry: '2025-01-30',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Órgão de Classe'],
    capacity: 30,
    teamSize: 15,
  },
  {
    id: 'a9',
    name: 'Dr. Henrique Almeida',
    personType: 'PF',
    specialty: 'Direito Cível',
    comarca: 'Aquidauana',
    classRegistration: 'OAB-MS 5566',
    registrationStatus: 'Ativo',
    activeProcesses: 1,
    largeCases: 0,
    liabilities: 5500000.00,
    approvedFees: 250000.00,
    paidFees: 200000.00,
    cnjAlert: false,
    alertText: 'Regular',
    cpfCnpjMasked: '***.222.111-**',
    registrationExpiry: '2024-09-15',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 5,
    teamSize: 2,
  },
  {
    id: 'a10',
    name: 'Centro Oeste Perícias Ltda',
    personType: 'PJ',
    specialty: 'Perícia Contábil',
    comarca: 'Nova Andradina',
    classRegistration: 'CRC-MS 7788/J',
    registrationStatus: 'Suspenso',
    activeProcesses: 1,
    largeCases: 0,
    liabilities: 12000000.00,
    approvedFees: 500000.00,
    paidFees: 100000.00,
    cnjAlert: true,
    alertText: 'Suspenso',
    cpfCnpjMasked: '22.***.***/0001-44',
    technicalLead: 'Sônia Mendes',
    registrationExpiry: '2023-12-01',
    certificates: [],
    capacity: 10,
    teamSize: 4,
  },
  {
    id: 'a11',
    name: 'Dr. Thiago Vasconcelos',
    personType: 'PF',
    specialty: 'Direito Tributário',
    comarca: 'Campo Grande',
    classRegistration: 'OAB-MS 3322',
    registrationStatus: 'Ativo',
    activeProcesses: 2,
    largeCases: 1,
    liabilities: 85000000.00,
    approvedFees: 2200000.00,
    paidFees: 800000.00,
    cnjAlert: false,
    alertText: 'Regular',
    cpfCnpjMasked: '***.555.444-**',
    registrationExpiry: '2025-06-20',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 12,
    teamSize: 3,
  },
  {
    id: 'a12',
    name: 'Fênix Recuperação Judicial SS',
    personType: 'PJ',
    specialty: 'Administração',
    comarca: 'Dourados',
    classRegistration: 'OAB-MS 111/J',
    registrationStatus: 'Ativo',
    activeProcesses: 2,
    largeCases: 2,
    liabilities: 320000000.00,
    approvedFees: 6400000.00,
    paidFees: 3200000.00,
    cnjAlert: false,
    alertText: 'Regular',
    cpfCnpjMasked: '33.***.***/0001-55',
    technicalLead: 'Luísa Nogueira',
    registrationExpiry: '2025-11-10',
    certificates: ['Tributária Federal', 'Cível Estadual', 'Criminal Estadual', 'Órgão de Classe'],
    capacity: 20,
    teamSize: 10,
  }
];

export const MOCK_PROCESSES: Process[] = [
  // Silva (a1): 3 Large RJs
  {
    id: 'p1',
    cnjNumber: '0801234-56.2023.8.12.0001',
    company: 'Agropecuária Boi Gordo S/A',
    actionType: 'Recuperação Judicial',
    comarcaCourt: '1ª Vara Cível - Campo Grande',
    appointingJudge: 'Dr. José da Silva',
    administratorId: 'a1',
    liabilities: 420000000.00,
    isLarge: true,
    approvedFees: 6300000.00,
    paidFees: 2000000.00,
    status: 'Ativo',
    appointmentDate: '2023-03-15'
  },
  {
    id: 'p2',
    cnjNumber: '0809876-12.2022.8.12.0001',
    company: 'Indústria Siderúrgica MS',
    actionType: 'Recuperação Judicial',
    comarcaCourt: '2ª Vara Cível - Campo Grande',
    appointingJudge: 'Dra. Maria Oliveira',
    administratorId: 'a1',
    liabilities: 380000000.00,
    isLarge: true,
    approvedFees: 5700000.00,
    paidFees: 1500000.00,
    status: 'Ativo',
    appointmentDate: '2022-08-20'
  },
  {
    id: 'p3',
    cnjNumber: '0812345-99.2021.8.12.0001',
    company: 'Construtora Edificar',
    actionType: 'Recuperação Judicial',
    comarcaCourt: 'Vara de Falências - Campo Grande',
    appointingJudge: 'Dr. Antonio Santos',
    administratorId: 'a1',
    liabilities: 650000000.00,
    isLarge: true,
    approvedFees: 9500000.00,
    paidFees: 1000000.00,
    status: 'Ativo',
    appointmentDate: '2021-11-05'
  },
  // Roberto (a2): 2 Large RJs + 1 Ordinary RJ
  {
    id: 'p4',
    cnjNumber: '0805555-44.2023.8.12.0002',
    company: 'Transportes Dourados',
    actionType: 'Recuperação Judicial',
    comarcaCourt: '1ª Vara Cível - Dourados',
    appointingJudge: 'Dra. Fernanda Lima',
    administratorId: 'a2',
    liabilities: 310000000.00,
    isLarge: true,
    approvedFees: 4650000.00,
    paidFees: 1000000.00,
    status: 'Ativo',
    appointmentDate: '2023-05-10'
  },
  {
    id: 'p5',
    cnjNumber: '0806666-33.2022.8.12.0002',
    company: 'Moinho Sul Matogrossense',
    actionType: 'Recuperação Judicial',
    comarcaCourt: '2ª Vara Cível - Dourados',
    appointingJudge: 'Dr. Ricardo Gomes',
    administratorId: 'a2',
    liabilities: 480000000.00,
    isLarge: true,
    approvedFees: 7200000.00,
    paidFees: 1100000.00,
    status: 'Ativo',
    appointmentDate: '2022-02-18'
  },
  {
    id: 'p6',
    cnjNumber: '0807777-22.2023.8.12.0003',
    company: 'Comércio de Secos e Molhados Três Lagoas',
    actionType: 'Recuperação Judicial',
    comarcaCourt: 'Vara Única - Três Lagoas',
    appointingJudge: 'Dra. Beatriz Santos',
    administratorId: 'a2',
    liabilities: 45000000.00,
    isLarge: false,
    approvedFees: 650000.00,
    paidFees: 0.00,
    status: 'Ativo',
    appointmentDate: '2023-01-25'
  },
  // Carolina (a3): 5 Falências
  {
    id: 'p7',
    cnjNumber: '0808888-11.2023.8.12.0003',
    company: 'Tecelagem MS',
    actionType: 'Falência',
    comarcaCourt: 'Vara Única - Três Lagoas',
    appointingJudge: 'Dra. Beatriz Santos',
    administratorId: 'a3',
    liabilities: 8000000.00,
    isLarge: false,
    approvedFees: 240000.00,
    paidFees: 150000.00,
    status: 'Ativo',
    appointmentDate: '2023-04-12'
  },
  {
    id: 'p8',
    cnjNumber: '0809999-00.2022.8.12.0003',
    company: 'Distribuidora Regional',
    actionType: 'Falência',
    comarcaCourt: 'Vara Única - Três Lagoas',
    appointingJudge: 'Dra. Beatriz Santos',
    administratorId: 'a3',
    liabilities: 12000000.00,
    isLarge: false,
    approvedFees: 480000.00,
    paidFees: 400000.00,
    status: 'Ativo',
    appointmentDate: '2022-09-30'
  },
  {
    id: 'p9',
    cnjNumber: '0801111-99.2023.8.12.0003',
    company: 'Supermercados Economia',
    actionType: 'Falência',
    comarcaCourt: 'Vara Única - Três Lagoas',
    appointingJudge: 'Dra. Beatriz Santos',
    administratorId: 'a3',
    liabilities: 6000000.00,
    isLarge: false,
    approvedFees: 300000.00,
    paidFees: 150000.00,
    status: 'Ativo',
    appointmentDate: '2023-07-05'
  },
  {
    id: 'p10',
    cnjNumber: '0802222-88.2023.8.12.0003',
    company: 'Farmácia da Esquina',
    actionType: 'Falência',
    comarcaCourt: 'Vara Única - Três Lagoas',
    appointingJudge: 'Dra. Beatriz Santos',
    administratorId: 'a3',
    liabilities: 4000000.00,
    isLarge: false,
    approvedFees: 330000.00,
    paidFees: 200000.00,
    status: 'Ativo',
    appointmentDate: '2023-08-20'
  },
  {
    id: 'p11',
    cnjNumber: '0803333-77.2023.8.12.0003',
    company: 'Posto de Combustíveis Rota',
    actionType: 'Falência',
    comarcaCourt: 'Vara Única - Três Lagoas',
    appointingJudge: 'Dra. Beatriz Santos',
    administratorId: 'a3',
    liabilities: 15000000.00,
    isLarge: false,
    approvedFees: 450000.00,
    paidFees: 300000.00,
    status: 'Ativo',
    appointmentDate: '2023-11-10'
  }
];

export const MOCK_AUDIT_ITEMS: AuditItem[] = [
  {
    id: 'au1',
    administratorId: 'a1',
    rule: 'Art. 7º Prov. 231 - 3+ Grandes RJs',
    reason: 'Proibição de novas nomeações por acúmulo de 3 ou mais processos de grande porte.',
    cases: '0801234-56.2023.8.12.0001, 0809876-12.2022.8.12.0001, 0812345-99.2021.8.12.0001',
    factDate: '2023-10-01',
    recommendedAction: 'VEDADO para novas nomeações conforme regulamento.',
    severity: 'Alta'
  },
  {
    id: 'au2',
    administratorId: 'a2',
    rule: 'Atenção - 2 Grandes RJs',
    reason: 'Profissional acumula 2 recuperações judiciais de grande porte concomitantemente.',
    cases: '0805555-44.2023.8.12.0002, 0806666-33.2022.8.12.0002',
    factDate: '2023-09-15',
    recommendedAction: 'Limitar novas nomeações de grande porte (Risco de atingir Art 7º).',
    severity: 'Média'
  },
  {
    id: 'au3',
    administratorId: 'a3',
    rule: 'Art. 5º §3 Res. 393 - Excesso >4',
    reason: 'Mais de 4 processos de insolvência (RJs ou Falências) ativos.',
    cases: 'Múltiplos (5 Falências)',
    factDate: '2023-11-20',
    recommendedAction: 'Atenção: Excesso de nomeações pode comprometer a eficiência.',
    severity: 'Média'
  },
  {
    id: 'au4',
    administratorId: 'a4',
    rule: 'Renovação Anual (Cadastro)',
    reason: 'Certidões vencidas e necessidade de atualização cadastral anual.',
    cases: 'Todos',
    factDate: '2023-10-16',
    recommendedAction: 'Notificação para regularização imediata sob pena de suspensão.',
    severity: 'Alta'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay1',
    processId: 'p1',
    administratorId: 'a1',
    fixedPercentage: 1.5, 
    referenceFees: 6300000.00,
    paid: 2000000.00,
    balance: 4300000.00,
    lastPayment: '2023-09-15'
  },
  {
    id: 'pay2',
    processId: 'p4',
    administratorId: 'a2',
    fixedPercentage: 1.5, 
    referenceFees: 4650000.00,
    paid: 1000000.00,
    balance: 3650000.00,
    lastPayment: '2023-08-22'
  },
  {
    id: 'pay3',
    processId: 'p7',
    administratorId: 'a3',
    fixedPercentage: 3.0, 
    referenceFees: 240000.00,
    paid: 150000.00,
    balance: 90000.00,
    lastPayment: '2023-11-05'
  }
];