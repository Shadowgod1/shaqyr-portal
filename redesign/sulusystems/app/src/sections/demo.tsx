import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PlayIcon } from "lucide-react"
import { SectionHead } from "@/components/sulu/section-head"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { requestDemo } from "@/lib/plan"
import { demo } from "@/content"

gsap.registerPlugin(ScrollTrigger)

/** The original "video coming soon" panel, lying back in 3D and standing up on scroll. */
export function Demo() {
  const screen = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  React.useLayoutEffect(() => {
    if (reduced || !screen.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        screen.current,
        { rotateX: 38, scale: 0.86, y: 40 },
        { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: screen.current, start: "top 95%", end: "center 55%", scrub: 1 } }
      )
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="demo" className="overflow-hidden bg-surface py-20 md:py-28">
      <div className="container-sulu">
        <SectionHead title={demo.title} lead={demo.lead} />
        <div className="mx-auto max-w-4xl" style={{ perspective: 1400 }}>
          <div
            ref={screen}
            className="relative flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#173f33,#064e3b_55%,#0a3a2c)] p-6 text-center text-[#f8f5ef] shadow-[0_60px_120px_-50px_rgba(6,46,34,0.7)]"
            style={{ transformOrigin: "50% 100%" }}
          >
            <div aria-hidden className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(50% 60% at 50% 40%, rgba(184,150,110,0.6), transparent 70%)" }} />
            <span className="relative flex size-20 items-center justify-center rounded-full border border-[#f8f5ef]/40 bg-[#f8f5ef]/10 backdrop-blur">
              <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-[#b8966e]/60 [animation-duration:2.4s]" />
              <PlayIcon aria-hidden className="size-8 translate-x-0.5" />
            </span>
            <p className="relative font-heading text-2xl font-semibold">{demo.soon}</p>
            <p className="relative text-sm opacity-80">{demo.soonSub}</p>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {demo.ask}{" "}
          <button type="button" onClick={() => requestDemo()} className="font-medium text-primary underline-offset-4 hover:underline">
            {demo.askLink}
          </button>
        </p>
      </div>
    </section>
  )
}
