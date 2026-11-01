export type UiRow = Record<string,string> & { id:string; createdAt:string }

export const dbTables: Record<string,string> = {
  Material: 'materials',
  Usuários: 'profiles',
  Vistorias: 'inspections',
  'Ordens de Serviço': 'service_orders',
  Escala: 'shifts',
  'Veículos de Aluguel': 'rental_vehicles',
  RST: 'traffic_accident_reports',
}

const roleToLabel: Record<string,string> = {
  admin: 'Administrador', gestor: 'Gestor', agente: 'Agente', consulta: 'Consulta',
}
const labelToRole: Record<string,string> = {
  Administrador: 'admin', Gestor: 'gestor', Agente: 'agente', Consulta: 'consulta',
}
const statusToLabel: Record<string,string> = {
  pending: 'Pendente', active: 'Ativo', blocked: 'Bloqueado',
}
const labelToStatus: Record<string,string> = {
  Pendente: 'pending', Ativo: 'active', Bloqueado: 'blocked',
}

export function fromDatabase(module: string, raw: Record<string, unknown>): UiRow {
  const values = module === 'Veículos de Aluguel' ? { ...raw, data_inicio: raw.data_inicio || '', data_fim: raw.data_fim || '' }
    : module === 'RST' ? { ...raw, numero: String(raw.numero ?? '').padStart(4,'0'), data_ocorrencia: raw.data_ocorrencia ? (()=>{const d=new Date(String(raw.data_ocorrencia));d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)})() : '' }
    : module === 'Usuários'
    ? {
        nome: raw.full_name, email: raw.email, telefone: raw.phone || '',
        cargo: raw.job_title || '', avatar_url: raw.avatar_url || '',
        perfil: roleToLabel[String(raw.role)] || 'Consulta',
        status: statusToLabel[String(raw.status)] || 'Pendente',
      }
    : raw
  const normalized = Object.fromEntries(Object.entries(values).map(([key,value]) => [key, value == null ? '' : String(value)]))
  return { ...normalized, id: String(raw.id), createdAt: String(raw.created_at || '') } as UiRow
}

export function toDatabase(module: string, form: Record<string,string>): Record<string,string> {
  if (module === 'Usuários') {
    return {
      full_name: form.nome, phone: form.telefone || '', job_title: form.cargo || '',
      role: labelToRole[form.perfil] || 'consulta',
      status: labelToStatus[form.status] || 'pending',
    }
  }
  const allowed: Record<string,string[]> = {
    Material: ['nome','categoria','codigo','quantidade','minimo','unidade','local','obs'],
    Vistorias: ['tipo','local','data','responsavel','resultado','parecer'],
    'Ordens de Serviço': ['titulo','categoria','local','solicitante','data','prioridade','status','descricao'],
    Escala: ['agente','data','turno','local','atividade','status','obs'],
    'Veículos de Aluguel': ['placa','marca','modelo','locadora','contrato','data_inicio','data_fim','valor_mensal','franquia_km','status','observacoes'],
    RST: ['data_ocorrencia','local','tipo','gravidade','envolvidos','veiculos','placas','danos','boletim_ocorrencia','descricao','providencias','status'],
  }
  const payload=Object.fromEntries((allowed[module] || []).filter(key => form[key] !== '').map(key => [key, form[key]])) as Record<string,string>
  if(module==='RST'&&payload.data_ocorrencia)payload.data_ocorrencia=new Date(payload.data_ocorrencia).toISOString()
  return payload
}

