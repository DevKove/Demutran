import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

type SignaturePadProps = { value?: string; onChange: (value: string) => void; label: string }

export default function SignaturePad({ value = '', onChange, label }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastValueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const redraw = (imageData: string) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const rect = canvas.getBoundingClientRect()
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const width = Math.max(1, rect.width)
    const height = Math.max(1, rect.height)
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.lineWidth = 2.4
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#172033'
    if (imageData.startsWith('data:image/')) {
      const image = new Image()
      image.onload = () => {
        if (canvasRef.current === canvas) context.drawImage(image, 0, 0, width, height)
      }
      image.src = imageData
    }
  }

  useEffect(() => {
    redraw(value)
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => redraw(lastValueRef.current))
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (value === lastValueRef.current) return
    lastValueRef.current = value
    redraw(value)
  }, [value])

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }
  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    const p = point(event)
    context.beginPath()
    context.moveTo(p.x, p.y)
    drawingRef.current = true
  }
  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    event.preventDefault()
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    const p = point(event)
    context.lineTo(p.x, p.y)
    context.stroke()
  }
  const finish = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    drawingRef.current = false
    const canvas = canvasRef.current
    if (canvas) {
      const imageData = canvas.toDataURL('image/png')
      lastValueRef.current = imageData
      onChangeRef.current(imageData)
    }
    if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }
  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.save()
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.restore()
    lastValueRef.current = ''
    onChangeRef.current('')
  }

  return <div className="signature-pad field-wide">
    <canvas ref={canvasRef} aria-label={label + ' — área para assinatura com toque ou mouse'} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} style={{display:'block',width:'100%',height:160,background:'#fff',border:'1px dashed #9aa3b2',borderRadius:8,touchAction:'none',cursor:'crosshair',userSelect:'none'}} />
    <div className="signature-pad-footer"><small>Assine acima usando o dedo, uma caneta touch ou o mouse.</small><button type="button" className="secondary-button" onClick={clear}>Limpar assinatura</button></div>
  </div>
}
