import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, LockKeyhole, Mail, TrafficCone, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Props = { children: ReactNode }
type Profile = { id:string; full_name:string; email:string; role:string; status:string }

export default function AuthGate({children}:Props) {
  const [session,setSession]=useState<any>(null)
  const [profile,setProfile]=useState<Profile|null>(null)
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState(false)
  const [mode,setMode]=useState<'login'|'signup'|'recovery'>('login')
  const [name,setName]=useState('')
  const [matricula,setMatricula]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [acceptedTerms,setAcceptedTerms]=useState(false)
  const [acceptedPrivacy,setAcceptedPrivacy]=useState(false)
  const [notice,setNotice]=useState('')
  const [error,setError]=useState('')

  const loadProfile=async(current:any)=>{
    setSession(current)
    if(!current){setProfile(null);return}
    const {data,error}=await supabase.from('profiles').select('id,full_name,email,role,status').eq('id',current.user.id).maybeSingle()
    if(error)throw error
    if(!data)throw new Error('Perfil não encontrado. Contate o administrador.')
    setProfile(data)
  }

  useEffect(()=>{
    let alive=true
    supabase.auth.getSession().then(({data,error})=>{
      if(error)throw error
      return loadProfile(data.session)
    }).catch(e=>{if(alive)setError(e.message||'Falha ao validar sessão.')}).finally(()=>{if(alive)setLoading(false)})
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{
      queueMicrotask(()=>{if(alive)loadProfile(next).catch(e=>setError(e.message||'Falha ao carregar perfil.'))})
    })
    return ()=>{alive=false;subscription.unsubscribe()}
  },[])

  const submit=async(event:FormEvent)=>{
    event.preventDefault();setBusy(true);setError('');setNotice('')
    try{
      if(mode==='signup'){
        const {data,error}=await supabase.auth.signUp({email:email.trim().toLowerCase(),password,options:{data:{full_name:name.trim(),matricula:matricula.trim(),terms_accepted:acceptedTerms,privacy_accepted:acceptedPrivacy,terms_version:'1.0',privacy_version:'1.0'},emailRedirectTo:'https://devkove.github.io/Demutran/'}})
        if(error)throw error
        if(data.session){await loadProfile(data.session);setNotice('Cadastro realizado. Aguarde a aprovação do administrador.')}
        else{setMode('login');setNotice('Cadastro enviado. Confirme seu e-mail e aguarde a aprovação do administrador.')}
      }else if(mode==='recovery'){
        const {error}=await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:'https://devkove.github.io/Demutran/'})
        if(error)throw error
        setMode('login');setNotice('Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.')
      }else{
        const {data,error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password})
        if(error)throw error
        await loadProfile(data.session)
      }
    }catch(e){setError(e instanceof Error?e.message:'Não foi possível concluir a operação.')}
    finally{setBusy(false)}
  }

  const activateFirstAdmin=async()=>{setBusy(true);setError('');try{const {data,error}=await supabase.rpc('claim_first_admin');if(error)throw error;if(!data)throw new Error('O primeiro administrador já foi definido. Solicite liberação ao administrador atual.');const {data:current}=await supabase.auth.getSession();await loadProfile(current.session);setNotice('Primeiro administrador ativado com sucesso.')}catch(error){setError(error instanceof Error?error.message:'Não foi possível ativar o administrador.')}finally{setBusy(false)}}
  const signOut=async()=>{setBusy(true);await supabase.auth.signOut();setSession(null);setProfile(null);setBusy(false)}
  if(loading)return <div className="auth-loading">Validando acesso seguro...</div>
  if(session&&profile?.status==='active')return <>{children}</>
  if(session)return <main className="auth-screen"><section className="auth-card"><div className="auth-logo"><TrafficCone size={28}/></div><h1>{profile?.status==='blocked'?'Acesso bloqueado':'Aguardando aprovação'}</h1><p>{profile?.status==='blocked'?'Esta conta está desativada. Contate o administrador.':'Seu cadastro foi recebido. Um administrador precisa aprovar seu acesso ao DEMUTRAN.'}</p>{profile?.status==='pending'&&<button className="auth-submit" onClick={activateFirstAdmin} disabled={busy}>Ativar primeiro administrador</button>}<button className="auth-submit" onClick={signOut} disabled={busy}>Sair da conta</button></section></main>

  return <main className="auth-screen"><section className="auth-card">
    <div className="auth-brand"><div className="auth-logo"><TrafficCone size={28}/></div><div><strong>DEMU<span>TRAN</span></strong><small>GESTÃO MUNICIPAL DE TRÂNSITO</small></div></div>
    <span className="auth-kicker">AMBIENTE RESTRITO</span>
    <h1>{mode==='login'?'Acesso ao sistema':mode==='signup'?'Solicitar acesso':'Recuperar senha'}</h1>
    <p className="auth-description">{mode==='login'?'Entre com suas credenciais institucionais.':mode==='signup'?'Crie seu cadastro. O acesso depende da aprovação do administrador.':'Informe seu e-mail para receber as instruções.'}</p>
    {notice&&<div className="auth-notice">{notice}</div>}{error&&<div className="auth-error" role="alert">{error}</div>}
    <form className="auth-form" onSubmit={submit}>
      {mode==='signup'&&<><label><span>Nome completo</span><div className="auth-input"><UserPlus size={18}/><input required minLength={3} value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></div></label><label><span>Matrícula funcional</span><div className="auth-input"><UserPlus size={18}/><input required minLength={1} maxLength={30} value={matricula} onChange={e=>setMatricula(e.target.value.trimStart())} autoComplete="off"/></div></label></>}
      <label><span>E-mail institucional</span><div className="auth-input"><Mail size={18}/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></div></label>
      {mode!=='recovery'&&<label><span>Senha (mínimo 10 caracteres)</span><div className="auth-input"><LockKeyhole size={18}/><input type="password" required minLength={10} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='login'?'current-password':'new-password'}/></div></label>}
      {mode==='signup'&&<div className="auth-legal-consents"><label className="auth-consent"><input type="checkbox" required checked={acceptedTerms} onChange={e=>setAcceptedTerms(e.target.checked)}/><span>Li e aceito os <a href={`${import.meta.env.BASE_URL}termos-de-uso.html`} target="_blank" rel="noreferrer">Termos de Uso</a> (versão 1.0).</span></label><label className="auth-consent"><input type="checkbox" required checked={acceptedPrivacy} onChange={e=>setAcceptedPrivacy(e.target.checked)}/><span>Li e estou ciente da <a href={`${import.meta.env.BASE_URL}politica-de-privacidade.html`} target="_blank" rel="noreferrer">Política de Privacidade</a> (versão 1.0).</span></label><p>O cadastro só será enviado após os dois itens serem marcados. O aceite e as versões serão registrados no banco de dados.</p></div>}
      {mode==='login'&&<button type="button" className="auth-link auth-forgot" onClick={()=>{setMode('recovery');setError('')}}>Esqueci minha senha</button>}
      <button className="auth-submit" disabled={busy||(mode==='signup'&&(!acceptedTerms||!acceptedPrivacy))}>{busy?'Aguarde...':mode==='login'?'Entrar':mode==='signup'?'Solicitar cadastro':'Enviar instruções'} <ArrowRight size={18}/></button>
    </form>
    <div className="auth-switch">{mode==='login'?'Ainda não possui acesso?':'Já possui cadastro?'} <button className="auth-link" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setNotice('')}}>{mode==='login'?'Solicitar acesso':'Voltar ao login'}</button></div>
    <div className="auth-security">Autenticação gerenciada pelo Supabase</div>
  </section><footer className="auth-footer">© 2026 DEMUTRAN · Departamento Municipal de Trânsito</footer></main>
}
