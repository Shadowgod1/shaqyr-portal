import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/badge"
import { SectionHead } from "@/components/sulu/section-head"
import { Tilt } from "@/components/sulu/tilt"
import { SuluIcon } from "@/components/sulu/icon"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { features } from "@/content"

gsap.registerPlugin(ScrollTrigger)

/** Cards rise out of a tilted 3D plane as the grid scrolls in (GSAP batch). */
export function Features() {
  const grid = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  React.useLayoutEffect(() => {
    if (reduced || !grid.current) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-feature]")
      gsap.set(cards, { opacity: 0, rotateX: 48, y: 80, z: -160, transformOrigin: "50% 100%" })
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, rotateX: 0, y: 0, z: 0, duration: 0.975, ease: "expo.out", stagger: 0.12, overwrite: true }),
      })
    }, grid)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-sulu">
        <SectionHead title={features.title} lead={features.lead} />
        <div ref={grid} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1600 }}>
          {features.items.map((f) => (
            <div key={f.title} data-feature className="h-full">
              <Tilt max={7} className="h-full rounded-3xl">
                <article className="flex h-full flex-col gap-4 rounded-3xl border bg-card p-7">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground" style={{ transform: "translateZ(40px)" }}>
                    <SuluIcon name={f.icon} className="size-6" />
                  </span>
                  <h3 className="text-xl leading-snug font-semibold" style={{ transform: "translateZ(24px)" }}>{f.title}</h3>
                  <p className="flex-1 leading-relaxed text-muted-foreground">{f.text}</p>
                  <div className="flex flex-col items-start gap-2 border-t pt-4">
                    <Badge variant="outline">{f.badge}</Badge>
                    <span className="text-sm text-muted-foreground">{f.note}</span>
                  </div>
                </article>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
