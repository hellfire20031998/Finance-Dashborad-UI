import { useEffect, useRef, useState } from "react"

type Props = {
  value: number
  format: (n: number) => string
  durationMs?: number
  skipAnimation?: boolean
}

function CountUpInner({
  value,
  format,
  durationMs = 500,
}: Omit<Props, "skipAnimation">) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const from = fromRef.current
    if (from === value) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - (1 - t) ** 2
      setDisplay(from + (value - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, durationMs])

  return <span className="tabular-nums">{format(display)}</span>
}

export function CountUpCurrency({
  value,
  format,
  durationMs = 500,
  skipAnimation,
}: Props) {
  if (skipAnimation) {
    return <span className="tabular-nums">{format(value)}</span>
  }
  return (
    <CountUpInner value={value} format={format} durationMs={durationMs} />
  )
}
