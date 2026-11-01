import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Props = { path?: string; name?: string }

export default function ProfilePhoto({ path, name }: Props) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let active = true
    if (!path) { setUrl(''); return }
    supabase.storage.from('user-photos').createSignedUrl(path, 60 * 60)
      .then(({ data, error }) => {
        if (active) setUrl(error ? '' : data?.signedUrl || '')
      })
    return () => { active = false }
  }, [path])

  return url
    ? <img src={url} alt={name ? 'Foto de ' + name : 'Foto do usuário'} loading="lazy" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d9ad00', flexShrink: 0 }} />
    : <span aria-label="Sem foto cadastrada" title="Sem foto cadastrada" style={{ width: 48, height: 48, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#eef0f3', color: '#596273', flexShrink: 0 }}><UserRound size={23}/></span>
}
