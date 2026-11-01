export const dbTables: Record<string,string> = {
  Material: 'materials',
  Usuários: 'profiles',
  Vistorias: 'inspections',
  'Ordens de Serviço': 'service_orders',
  Escala: 'shifts',
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

export function fromDatabase(module: string, raw: Record<string, unknown>) {
  const values = module === 'Usuários'
    ? {
        nome: raw.full_name, email: raw.email, telefone: raw.phone || '',
        cargo: raw.job_title || '',
        perfil: roleToLabel[String(raw.role)] || 'Consulta',
        status: statusToLabel[String(raw.status)] || 'Pendente',
      }
    : raw
  return { ...values, id: String(raw.id), createdAt: String(raw.created_at || '') }
}

export function toDatabase(module: string, form: Record<string,string>) {
  if (module === 'Usuários') {
    return {
      full_name: form.nome, phone: form.telefone || null, job_title: form.cargo || null,
      role: labelToRole[form.perfil] || 'consulta',
      status: labelToStatus[form.status] || 'pending',
    }
  }
  const allowed: Record<string,string[]> = {
    Material: ['nome','categoria','codigo','quantidade','minimo','unidade','local','obs'],
    Vistorias: ['tipo','local','data','responsavel','resultado','parecer'],
    'Ordens de Serviço': ['titulo','categoria','local','solicitante','data','prioridade','status','descricao'],
    Escala: ['agente','data','turno','local','atividade','status','obs'],
  }
  return Object.fromEntries((allowed[module] || []).map(key => [key, form[key] ?? null]))
}
