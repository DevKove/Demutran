import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

type SignaturePadProps = {
  value?: string
  onChange: (value: string) => void
  label: string
}

export default function SignaturePad({ value = '', onChange, label }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const changedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.lineWidth = 2.2
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#172033'
    if (value.startsWith('data:image/')) {
      const image = new Image()
      image.onload = () => context.drawImage(image, 0, 0, width, height)
      image.src = value
    }
  }, [value])

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    const p = point(event)
    context.beginPath()
    context.moveTo(p.x, p.y)
    drawingRef.current = true
    changedRef.current = true
  }

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    event.preventDefault()
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    const p = point(event)
    context.lineTo(p.x, p.y)
    context.stroke()
  }

  const finish = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    drawingRef.current = false
    const canvas = canvasRef.current
    if (canvas && changedRef.current) onChange(canvas.toDataURL('image/png'))
    changedRef.current = false
    if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div className="signature-pad field-wide">
      <canvas
        ref={canvasRef}
        aria-label={label + ' — área para assinatura com toque ou mouse'}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={finish}
        style={{ display: 'block', width: '100%', height: 150, background: '#fff', border: '1px dashed #9aa3b2', borderRadius: 8, touchAction: 'none', cursor: 'crosshair' }}
      />
      <div className="signature-pad-footer">
        <small>Assine acima usando o dedo, uma caneta touch ou o mouse.</small>
        <button type="button" className="secondary-button" onClick={clear}>Limpar assinatura</button>
      </div>
    </div>
  )
}
