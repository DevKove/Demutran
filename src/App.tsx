import { useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowRight, ArrowUpRight,
  Bell, CalendarDays, CarFront, CheckCircle2, ChevronDown, ClipboardCheck,
  ClipboardList, Clock3, Command, FileText, LayoutDashboard, LogOut,
  Menu, Package, Plus, Search, Settings2, ShieldCheck, TrafficCone,
  Truck, UserRound, Users, Wrench, X,
} from 'lucide-react'

type ModuleKey = 'Início' | 'Material' | 'Usuários' | 'Vistorias' | 'Ordens de Serviço' | 'Escala'
const navigation: { label: ModuleKey; icon: typeof LayoutDashboard }[] = [
  { label: 'Início', icon: LayoutDashboard },
  { label: 'Material', icon: Package },
  { label: 'Usuários', icon: Users },
  { label: 'Vistorias', icon: ClipboardCheck },
  { label: 'Ordens de Serviço', icon: Wrench },
  { label: 'Escala', icon: CalendarDays },
]
const metrics = [
  { label: 'Vistorias no mês', value: '128', change: '+12,8%', icon: ClipboardCheck, tone: 'yellow' },
  { label: 'Ordens em andamento', value: '08', change: '03 urgentes', icon: Wrench, tone: 'blue' },
  { label: 'Itens em estoque', value: '1.284', change: '12 abaixo do mínimo', icon: Package, tone: 'green' },
  { label: 'Agentes em serviço', value: '24', change: 'De 32 cadastrados', icon: ShieldCheck, tone: 'purple' },
]
const orders = [
  { id: 'OS-2026-0148', title: 'Manutenção de sinalização', area: 'Engenharia de Tráfego', date: '31/10/2026', status: 'Em execução', priority: 'Alta' },
  { id: 'OS-2026-0147', title: 'Reparo de semáforo', area: 'Sinalização Semafórica', date: '31/10/2026', status: 'Aguardando', priority: 'Urgente' },
  { id: 'OS-2026-0146', title: 'Pintura de faixa de pedestres', area: 'Sinalização Viária', date: '30/10/2026', status: 'Concluída', priority: 'Média' },
  { id: 'OS-2026-0145', title: 'Instalação de placa', area: 'Sinalização Viária', date: '30/10/2026', status: 'Em execução', priority: 'Baixa' },
]
const moduleDetails: Record<Exclude<ModuleKey, 'Início'>, { subtitle: string; actions: string[]; description: string }> = {
  Material: { subtitle: 'Controle de materiais e patrimônio operacional', actions: ['Catálogo de materiais', 'Controle de estoque', 'Entradas e saídas', 'Histórico de movimentações'], description: 'Gerencie materiais, equipamentos, sinalizações e insumos utilizados pelas equipes do departamento.' },
  Usuários: { subtitle: 'Gestão de usuários, equipes e permissões', actions: ['Cadastrar usuário', 'Gerenciar acessos', 'Perfis e permissões', 'Registro de atividades'], description: 'Administre os acessos ao sistema e mantenha o controle das atividades realizadas por cada usuário.' },
  Vistorias: { subtitle: 'Planejamento e registro de vistorias de trânsito', actions: ['Nova vistoria', 'Agenda de vistorias', 'Vistorias pendentes', 'Laudos e histórico'], description: 'Organize inspeções, registre evidências, emita pareceres e acompanhe as vistorias realizadas.' },
  'Ordens de Serviço': { subtitle: 'Abertura e acompanhamento de solicitações', actions: ['Abrir ordem de serviço', 'Ordens pendentes', 'Acompanhar execução', 'Relatórios de serviços'], description: 'Centralize solicitações de manutenção, sinalização e serviços operacionais, do registro à conclusão.' },
  Escala: { subtitle: 'Organização de agentes, turnos e plantões', actions: ['Montar escala', 'Escala diária', 'Equipes e agentes', 'Ausências e substituições'], description: 'Distribua equipes e agentes por turno, local de atuação e tipo de operação.' },
}
function App() {
  const [active, setActive] = useState<ModuleKey>('Início')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const currentDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())
  const module = active === 'Início' ? null : moduleDetails[active]

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><TrafficCone size={27} strokeWidth={2.4} /></div>
        <div><strong>DEMU<span>TRAN</span></strong><small>GESTÃO MUNICIPAL DE TRÂNSITO</small></div>
        <button className="mobile-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"><X size={19}/></button>
      </div>
      <div className="sidebar-label">MENU PRINCIPAL</div>
      <nav className="nav-list">
        {navigation.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setSidebarOpen(false) }}>
          <Icon size={19}/><span>{label}</span>{label === 'Ordens de Serviço' && <i className="nav-count">8</i>}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><ShieldCheck size={18}/></div><strong>Operação segura</strong><p>Gestão integrada para um trânsito melhor.</p></div>
        <button className="nav-item"><Settings2 size={19}/><span>Configurações</span></button>
        <div className="sidebar-version">DEMUTRAN <span>v0.1.0</span></div>
      </div>
    </aside>
    {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"/>}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu"><Menu size={21}/></button><div className="breadcrumb">Departamento <span>/</span> <strong>{active}</strong></div></div>
        <div className="topbar-actions">
          <label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar no sistema..."/><kbd>⌘ K</kbd></label>
          <div className="notification-wrap"><button className="icon-button notification-button" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notificações"><Bell size={19}/><i/></button>{showNotifications && <div className="notification-popover"><strong>Notificações</strong><p><AlertTriangle size={15}/> 3 materiais abaixo do estoque mínimo</p><p><ClipboardList size={15}/> 2 ordens aguardando atendimento</p></div>}</div>
          <div className="profile"><div className="avatar">AD</div><div className="profile-info"><strong>Administrador</strong><small>Gestor do sistema</small></div><ChevronDown size={15} className="profile-chevron"/></div>
        </div>
      </header>
      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow"><span/> DEPARTAMENTO MUNICIPAL DE TRÂNSITO</div><h1>{active === 'Início' ? 'Visão geral' : active}</h1><p>{active === 'Início' ? 'Acompanhe os indicadores e a operação do departamento.' : module?.subtitle}</p></div><div className="heading-date"><CalendarDays size={16}/><span>{currentDate}</span></div></div>
        {active === 'Início' ? <>
          <section className="welcome-banner"><div className="welcome-copy"><div className="welcome-tag"><Activity size={14}/> PAINEL OPERACIONAL</div><h2>Mobilidade urbana com<br/><span>gestão e eficiência.</span></h2><p>Bem-vindo ao centro de operações do DEMUTRAN.</p><button className="banner-button" onClick={() => setActive('Ordens de Serviço')}>Acessar operações <ArrowRight size={16}/></button></div><div className="banner-art"><div className="road-sign sign-one"><TrafficCone size={31}/></div><div className="road-sign sign-two"><CarFront size={37}/></div><div className="road-line"/></div><div className="banner-watermark">D</div></section>
          <section className="metrics-grid">{metrics.map(({label,value,change,icon:Icon,tone}) => <article className="metric-card" key={label}><div className="metric-top"><div className={`metric-icon ${tone}`}><Icon size={20}/></div><button className="metric-more" aria-label={`Detalhes: ${label}`}><ArrowUpRight size={17}/></button></div><div className="metric-value">{value}</div><div className="metric-bottom"><span>{label}</span><small>{change}</small></div></article>)}</section>
          <section className="dashboard-grid"><article className="panel orders-panel"><div className="panel-heading"><div><h3>Ordens de serviço recentes</h3><p>Acompanhamento das últimas solicitações</p></div><button className="text-action" onClick={() => setActive('Ordens de Serviço')}>Ver todas <ArrowRight size={15}/></button></div><div className="table-wrap"><table><thead><tr><th>IDENTIFICAÇÃO</th><th>SERVIÇO</th><th>DATA</th><th>STATUS</th><th>PRIORIDADE</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td className="order-id">{order.id}</td><td><strong>{order.title}</strong><small>{order.area}</small></td><td>{order.date}</td><td><span className={`status status-${order.status.toLowerCase().replace(' ','-')}`}>{order.status}</span></td><td><span className={`priority priority-${order.priority.toLowerCase()}`}>{order.priority}</span></td></tr>)}</tbody></table></div></article>
          <article className="panel activity-panel"><div className="panel-heading"><div><h3>Resumo da operação</h3><p>Indicadores de hoje</p></div><button className="icon-button subtle"><ArrowUpRight size={17}/></button></div><div className="operation-score"><div className="score-ring"><div><strong>86<span>%</span></strong><small>eficiência</small></div></div><div className="score-caption"><CheckCircle2 size={16}/><span>Operação dentro da meta</span></div></div><div className="operation-row"><span><i className="dot dot-yellow"/>Vistorias realizadas</span><strong>18 / 22</strong></div><div className="progress"><i style={{width:'82%'}}/></div><div className="operation-row"><span><i className="dot dot-blue"/>Ordens concluídas</span><strong>12 / 15</strong></div><div className="progress blue-progress"><i style={{width:'80%'}}/></div><div className="operation-row"><span><i className="dot dot-green"/>Escalas preenchidas</span><strong>24 / 24</strong></div><div className="progress green-progress"><i style={{width:'100%'}}/></div></article></section>
          <section className="bottom-grid"><article className="shortcut-card"><div className="shortcut-icon"><Plus size={20}/></div><div><strong>Acesso rápido</strong><p>Inicie uma nova atividade operacional.</p></div><div className="shortcut-actions"><button onClick={() => setActive('Vistorias')}><ClipboardCheck size={16}/> Nova vistoria</button><button onClick={() => setActive('Ordens de Serviço')}><Wrench size={16}/> Nova ordem</button><button onClick={() => setActive('Material')}><Package size={16}/> Movimentar material</button></div></article><article className="notice-card"><div className="notice-symbol"><AlertTriangle size={19}/></div><div><strong>Atenção ao estoque</strong><p>12 itens estão abaixo do nível mínimo e precisam de reposição.</p><button className="text-action" onClick={() => setActive('Material')}>Conferir materiais <ArrowRight size={14}/></button></div></article></section>
        </> : <section className="module-layout"><div className="module-intro panel"><div className="module-intro-icon">{active === 'Material' ? <Package/> : active === 'Usuários' ? <Users/> : active === 'Vistorias' ? <ClipboardCheck/> : active === 'Escala' ? <CalendarDays/> : <Wrench/>}</div><div><h2>Gestão de {active.toLowerCase()}</h2><p>{module?.description}</p></div></div><div className="module-actions-grid">{module?.actions.map((action,index) => <button className="module-action panel" key={action} onClick={() => alert('Estrutura inicial: esta funcionalidade será implementada na próxima etapa.')}><div className="module-action-icon">{index === 0 ? <Plus/> : index === 1 ? <ClipboardList/> : index === 2 ? <Activity/> : <FileText/>}</div><div><strong>{action}</strong><small>Acessar módulo <ArrowRight size={13}/></small></div><ArrowUpRight className="module-arrow" size={18}/></button>)}</div><div className="empty-state panel"><div className="empty-icon"><Command size={25}/></div><h3>Área de trabalho preparada</h3><p>A estrutura visual de {active.toLowerCase()} está pronta para receber formulários, tabelas, filtros e operações integradas.</p><button className="primary-button" onClick={() => setActive('Início')}>Voltar ao início</button></div></section>}
        <footer className="footer"><span>© 2026 DEMUTRAN — Departamento Municipal de Trânsito</span><span>Sistema de Gestão Municipal <i/> Ambiente inicial</span></footer>
      </div>
    </main>
  </div>
}
export default App
