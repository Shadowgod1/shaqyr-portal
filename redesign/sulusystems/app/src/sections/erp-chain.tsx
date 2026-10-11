import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChapterHead } from "@/components/sulu/chapter"
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
    <section ref={section} id="erp" className="relative overflow-hidden bg-background pb-24 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pb-10">
      <div className="container-sulu w-full">
        <ChapterHead n={1} caption={erp.kicker} title={erp.title} lead={erp.lead} className={use3d ? "[&>div:last-child]:mb-6 [&>div:last-child]:pt-8" : undefined} />

        {use3d && (
          <div className="relative h-[300px]" style={{ perspective: 1400 }} aria-hidden>
            <div ref={ring} className="preserve-3d absolute inset-0 m-auto h-[230px] w-[280px]">
              {erp.steps.map((s, i) => (
                <div
                  key={s.title}
                  className={cn(
                    "backface-hidden absolute inset-0 flex flex-col justify-between border rule-strong bg-card p-6 shadow-[0_30px_60px_-30px_rgba(6,46,34,0.45)] transition-opacity duration-[var(--duration-medium)]",
                    i === active ? "opacity-100" : "opacity-50"
                  )}
                  style={{ transform: `rotateY(${i * STEP}deg) translateZ(270px)` }}
                >
                  <span className="folio text-7xl text-primary">{i + 1}</span>
                  <div className="flex flex-col gap-1.5">
                    <strong className="text-xl tracking-tight">{s.title.replace(/^\d\.\s/, "")}</strong>
                    <span className="text-sm text-muted-foreground">{s.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ol className="grid grid-cols-2 border-t rule-strong md:grid-cols-3 lg:grid-cols-6" aria-label="Цепочка одного визита">
          {erp.steps.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                "relative flex min-h-[150px] flex-col gap-8 border-b border-l px-4 pt-5 pb-6 first:border-l-0 md:border-b-0 lg:min-h-[170px]",
                "max-md:[&:nth-child(odd)]:border-l-0 md:max-lg:[&:nth-child(3n+1)]:border-l-0"
              )}
            >
              {use3d && (
                <span
                  aria-hidden
                  className="absolute -top-px left-0 h-1 bg-gold transition-[width] duration-[var(--duration-medium)] ease-[var(--ease-standard)]"
                  style={{ width: i <= active ? "100%" : "0%" }}
                />
              )}
              <b className={cn("folio text-[40px] transition-colors", use3d && i !== active ? "text-muted-foreground" : "text-foreground")}>{i + 1}</b>
              <span className="text-[15px] font-medium">{s.title.replace(/^\d\.\s/, "")} — <span className="font-normal text-muted-foreground">{s.text}</span></span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
