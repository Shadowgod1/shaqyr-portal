import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/badge"
import { ChapterHead } from "@/components/sulu/chapter"
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
    <section id="features" className="scroll-mt-16 pb-24 md:pb-32">
      <div className="container-sulu">
        <ChapterHead n={5} caption="Возможности" title={features.title} lead={features.lead} />
        <div ref={grid} className="grid border-t rule-strong md:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1600 }}>
          {features.items.map((f, i) => (
            <div
              key={f.title}
              data-feature
              className="h-full border-b md:[&:nth-child(even)]:border-l lg:[&:nth-child(even)]:border-l-0 lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <Tilt max={6} className="h-full">
                <article className="flex h-full flex-col gap-4 bg-background px-6 pt-7 pb-9 md:px-7">
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(36px)" }}>
                    <span className="text-[15px] font-bold text-[color:var(--kicker)]">5.{i + 1}</span>
                    <SuluIcon name={f.icon} className="size-6 text-primary" />
                  </div>
                  <h3 className="text-2xl leading-[1.12]" style={{ transform: "translateZ(20px)" }}>
                    {f.title}
                  </h3>
                  <p className="flex-1 text-base text-muted-foreground">{f.text}</p>
                  <div className="flex flex-col items-start gap-2 border-t rule-strong pt-3">
                    <Badge variant="secondary">{f.badge}</Badge>
                    <span className="text-sm font-medium">{f.note}</span>
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
