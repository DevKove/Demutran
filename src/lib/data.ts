export type UiRow = Record<string,string> & { id:string; createdAt:string }

export const dbTables: Record<string,string> = {
  Material: 'materials',
  Usuários: 'profiles',
  Vistorias: 'inspections',
  'Ordens de Serviço': 'service_orders',
  Escala: 'shifts',
  'Veículos de Aluguel': 'rental_vehicles',
  Sinistro: 'traffic_accident_reports',
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
    : module === 'Sinistro' ? { ...raw, numero: String(raw.numero ?? '').padStart(4,'0'), data_ocorrencia: raw.data_ocorrencia ? (()=>{const d=new Date(String(raw.data_ocorrencia));d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)})() : '' }
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
    Sinistro: ['data_ocorrencia','municipio','local','local_numero',
    'v1_placa','v1_renavam','v1_marca_modelo','v1_especie_tipo','v1_ano_fabricacao','v1_ano_modelo','v1_cor','v1_condutor','v1_sexo','v1_categoria_cnh','v1_data_nascimento','v1_validade_cnh','v1_registro_cnh','v1_telefone','v1_endereco_condutor','v1_municipio_condutor','v1_proprietario','v1_endereco_proprietario','v1_municipio_proprietario',
    'v2_placa','v2_renavam','v2_marca_modelo','v2_especie_tipo','v2_ano_fabricacao','v2_ano_modelo','v2_cor','v2_condutor','v2_sexo','v2_categoria_cnh','v2_data_nascimento','v2_validade_cnh','v2_registro_cnh','v2_telefone','v2_endereco_condutor','v2_municipio_condutor','v2_proprietario','v2_endereco_proprietario','v2_municipio_proprietario',
    'testemunha1_nome','testemunha1_rg','testemunha1_endereco','testemunha1_telefone','testemunha2_nome','testemunha2_rg','testemunha2_endereco','testemunha2_telefone','versao_v1','versao_v2','danos_veiculo1','danos_veiculo2','assinatura_condutor1','assinatura_condutor2','comunicante1_nome','comunicante1_assinatura','comunicante1_cpf','comunicante2_nome','comunicante2_assinatura','comunicante2_cpf','servidor_nome','servidor_matricula','servidor_assinatura','data_registro'],
  }
  const payload=Object.fromEntries((allowed[module] || []).filter(key => form[key] !== '').map(key => [key, form[key]])) as Record<string,string>
  if(module==='Sinistro'){for(const key of ['v1_data_nascimento','v1_validade_cnh','v2_data_nascimento','v2_validade_cnh','data_registro'])if(payload[key]==='')delete payload[key];}\n  if(module==='Sinistro'&&payload.data_ocorrencia)payload.data_ocorrencia=new Date(payload.data_ocorrencia).toISOString()
  return payload
}

