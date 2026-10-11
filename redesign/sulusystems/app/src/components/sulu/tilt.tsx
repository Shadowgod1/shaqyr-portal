import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * Pointer-driven 3D tilt with a moving glare — the Vanilla-Tilt technique from the
 * lightweight-3d-effects skill, written inline so it follows React's lifecycle.
 * Touch devices and reduced-motion users get a flat card.
 */
export function Tilt({
  children,
  className,
  max = 10,
  scale = 1.02,
  glare = true,
  lift = 0,
  ...props
}: React.ComponentProps<"div"> & { max?: number; scale?: number; glare?: boolean; lift?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const frame = React.useRef(0)

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`)
      el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`)
      el.style.setProperty("--s", String(scale))
      el.style.setProperty("--gx", `${px * 100}%`)
      el.style.setProperty("--gy", `${py * 100}%`)
      el.style.setProperty("--go", "1")
    })
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.style.setProperty("--s", "1")
    el.style.setProperty("--go", "0")
  }

  return (
    <div className={cn("perspective", className)} {...props}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="preserve-3d relative h-full rounded-[inherit] transition-transform duration-[var(--duration-medium)] ease-[var(--ease-standard)] will-change-transform"
        style={{
          transform: `translateZ(${lift}px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--s,1))`,
        }}
      >
        {children}
        {glare && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-[var(--duration-medium)]"
            style={{
              opacity: "var(--go,0)",
              background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.28), transparent 55%)",
              mixBlendMode: "soft-light",
            }}
          />
        )}
      </div>
    </div>
  )
}
