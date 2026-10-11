import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SectionHead } from "@/components/sulu/section-head"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { useMediaQuery, useReducedMotion } from "@/hooks/use-reduced-motion"
import { erp } from "@/content"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const N = erp.steps.length
const STEP = 360 / N

/**
 * Six links of one visit, mounted on a 3D cylinder. On desktop the section pins and
 * scroll turns the cylinder one face per step (GSAP ScrollTrigger, scrub). Mobile and
 * reduced-motion users get the same six cards as a plain staggered grid.
 */
export function ErpChain() {
  const wide = useMediaQuery("(min-width: 1024px)")
  const reduced = useReducedMotion()
  const use3d = wide && !reduced
  const section = React.useRef<HTMLElement>(null)
  const ring = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!use3d || !section.current || !ring.current) return
    const ctx = gsap.context(() => {
      gsap.to(ring.current, {
        rotateY: -STEP * (N - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: `+=${N * 55}%`,
          pin: true,
          scrub: 1,
          snap: { snapTo: 1 / (N - 1), duration: 0.4, ease: "power1.inOut" },
          onUpdate: (st) => setActive(Math.round(st.progress * (N - 1))),
        },
      })
    }, section)
    return () => ctx.revert()
  }, [use3d])

  return (
    <section ref={section} id="erp" className="relative overflow-hidden bg-surface py-20 md:py-28 lg:flex lg:min-h-svh lg:items-center">
      <div className="container-sulu w-full">
        <SectionHead kicker={erp.kicker} title={erp.title} lead={erp.lead} className="lg:mb-10" />

        {use3d ? (
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
            <ol className="flex flex-col gap-1" aria-label="Цепочка одного визита">
              {erp.steps.map((s, i) => (
                <li
                  key={s.title}
                  className={cn(
                    "flex items-baseline gap-4 rounded-xl px-4 py-3 transition-colors duration-[var(--duration-medium)]",
                    i === active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  <strong className={cn("font-heading text-lg whitespace-nowrap", i === active && "text-primary")}>{s.title}</strong>
                  <span className="text-sm">{s.text}</span>
                </li>
              ))}
            </ol>
            <div className="perspective relative h-[380px]" style={{ perspective: 1400 }} aria-hidden>
              <div ref={ring} className="preserve-3d absolute inset-0 m-auto h-[260px] w-[300px]">
                {erp.steps.map((s, i) => (
                  <div
                    key={s.title}
                    className={cn(
                      "backface-hidden absolute inset-0 flex flex-col justify-between rounded-3xl border bg-card p-7 shadow-[0_30px_60px_-30px_rgba(6,46,34,0.45)] transition-opacity duration-[var(--duration-medium)]",
                      i === active ? "opacity-100" : "opacity-60"
                    )}
                    style={{ transform: `rotateY(${i * STEP}deg) translateZ(300px)` }}
                  >
                    <span className="font-heading text-7xl leading-none font-semibold text-gold">{i + 1}</span>
                    <div className="flex flex-col gap-2">
                      <strong className="font-heading text-2xl">{s.title.replace(/^\d\.\s/, "")}</strong>
                      <span className="text-muted-foreground">{s.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <RevealGroup className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {erp.steps.map((s, i) => (
              <RevealItem key={s.title} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 text-center">
                <span className="font-heading text-3xl font-semibold text-gold">{i + 1}</span>
                <strong className="text-sm">{s.title.replace(/^\d\.\s/, "")}</strong>
                <span className="text-xs leading-snug text-muted-foreground">{s.text}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  )
}
