import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useInView } from "motion/react"
import { MessageSquareIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/sulu/reveal"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { requestDemo } from "@/lib/plan"
import { ai } from "@/content"

gsap.registerPlugin(ScrollTrigger)

export function AiAssistant() {
  const panel = React.useRef<HTMLDivElement>(null)
  const chat = React.useRef<HTMLDivElement>(null)
  const inView = useInView(chat, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()

  // Panel starts turned away in 3D and squares up to the reader as it scrolls in.
  React.useLayoutEffect(() => {
    if (reduced || !panel.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel.current,
        { rotateY: -24, rotateX: 10, z: -120 },
        {
          rotateY: -6,
          rotateX: 2,
          z: 0,
          ease: "none",
          scrollTrigger: { trigger: panel.current, start: "top bottom", end: "center center", scrub: 1 },
        }
      )
    })
    return () => ctx.revert()
  }, [reduced])

  const showAnswer = inView || reduced

  return (
    <section id="ai" className="relative overflow-hidden py-20 md:py-28">
      <div className="container-sulu grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="flex flex-col items-start gap-5">
          <Badge variant="secondary" className="h-7 gap-1.5 px-3">
            <SparklesIcon data-icon="inline-start" />
            {ai.badge}
          </Badge>
          <h2 className="text-3xl leading-[1.12] font-semibold tracking-tight md:text-[2.6rem]">{ai.title}</h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{ai.lead}</p>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            {ai.privacy}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="outline" onClick={() => requestDemo("Бизнес")}>
              {ai.ctaDemo}
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#pricing">{ai.ctaPricing}</a>
            </Button>
          </div>
        </Reveal>

        <div className="perspective" style={{ perspective: 1600 }}>
          <div ref={panel} className="preserve-3d rounded-3xl border bg-card p-5 shadow-[0_50px_100px_-40px_rgba(6,46,34,0.5)] md:p-7">
            <div className="flex flex-col gap-2" aria-label="Примеры вопросов">
              {ai.questions.map((q, i) => (
                <div
                  key={q}
                  className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm"
                  style={{ transform: `translateZ(${30 - i * 10}px)` }}
                >
                  <MessageSquareIcon aria-hidden className="size-4 shrink-0 text-primary" />
                  {q}
                </div>
              ))}
            </div>
            <div ref={chat} className="mt-6 flex flex-col gap-3" style={{ transform: "translateZ(60px)" }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={showAnswer ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.41, ease: [0.24, 1, 0.4, 1] }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground"
              >
                {ai.questions[0]}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={showAnswer ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.41, ease: [0.24, 1, 0.4, 1] }}
                className="max-w-[92%] rounded-2xl rounded-bl-md border bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground"
              >
                <TypedAnswer start={showAnswer} instant={reduced} />
              </motion.div>
              <p className="text-xs text-muted-foreground">{ai.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Types the original example answer word by word; bold figures stay bold. */
function TypedAnswer({ start, instant }: { start: boolean; instant: boolean }) {
  const parts = React.useMemo(
    () => [
      { t: ai.answer.before, b: false },
      { t: ai.answer.revenue, b: true },
      { t: ai.answer.middle, b: false },
      { t: ai.answer.drop, b: true },
      { t: ai.answer.after, b: false },
    ],
    []
  )
  const total = parts.reduce((n, p) => n + p.t.length, 0)
  const [typed, setShown] = React.useState(0)
  const shown = instant ? total : typed

  React.useEffect(() => {
    if (instant || !start) return
    let n = 0
    const id = window.setInterval(() => {
      n = Math.min(total, n + 3)
      setShown(n)
      if (n >= total) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [start, instant, total])

  let left = shown
  return (
    <span>
      <span className="sr-only">{parts.map((p) => p.t).join("")}</span>
      <span aria-hidden>
        {parts.map((p, i) => {
          const txt = p.t.slice(0, Math.max(0, left))
          left -= p.t.length
          return p.b ? <b key={i}>{txt}</b> : <React.Fragment key={i}>{txt}</React.Fragment>
        })}
        {shown < total && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />}
      </span>
    </span>
  )
}
