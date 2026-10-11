import { motion } from "motion/react"
import { CheckIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { lazy, Suspense, useEffect, useState } from "react"
import { Tilt } from "@/components/sulu/tilt"
import { fadeUp, stagger } from "@/components/sulu/reveal"
import { SITE, hero } from "@/content"
import heroImg from "@/assets/sulu/landing-hero.webp"
import { requestDemo } from "@/lib/plan"

const HeroScene = lazy(() => import("@/three/hero-scene").then((m) => ({ default: m.HeroScene })))

export function Hero() {
  const [marked, setMarked] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMarked(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <section id="top" className="relative isolate overflow-hidden pt-6 pb-20 md:pt-10 md:pb-28">
      {/* soft emerald/gold wash behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 30%, color-mix(in oklch, var(--sulu-emerald) 14%, transparent), transparent 70%), radial-gradient(40% 40% at 10% 90%, color-mix(in oklch, var(--sulu-gold) 16%, transparent), transparent 70%)",
        }}
      />
      <div className="container-sulu grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 flex flex-col items-start gap-6">
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="h-7 px-3 text-xs font-semibold tracking-wide uppercase">
              {hero.kicker}
            </Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-[2.5rem] leading-[1.06] font-semibold tracking-tight text-primary sm:text-5xl lg:text-[3.6rem]">
            {hero.titleLines[0]}
            <br />
            {hero.titleLines[1]}
            <br />
            {hero.titleLines[2]}{" "}
            <span
              className="box-decoration-clone bg-[linear-gradient(transparent_62%,color-mix(in_oklch,var(--sulu-gold)_38%,transparent)_62%,color-mix(in_oklch,var(--sulu-gold)_38%,transparent)_92%,transparent_92%)] bg-no-repeat italic transition-[background-size] delay-700 duration-[var(--duration-slow)] ease-[var(--ease-standard)]"
              style={{ backgroundSize: marked ? "100% 100%" : "0% 100%" }}
            >
              {hero.titleAccent}
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {hero.lead}
          </motion.p>
          <motion.div variants={fadeUp} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="xl" onClick={() => requestDemo()} className="shadow-[0_12px_30px_-10px_var(--glow)]">
              {hero.ctaPrimary}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button asChild size="xl" variant="secondary">
              <a href={`${SITE}/signup`}>{hero.ctaSecondary}</a>
            </Button>
          </motion.div>
          <motion.ul variants={fadeUp} className="flex flex-col gap-2 text-sm text-muted-foreground">
            {hero.checks.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                {c}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <Suspense fallback={null}>
            <HeroScene className="absolute -inset-[18%] -z-10" />
          </Suspense>
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: -22 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.24, 1, 0.4, 1] }}
            className="perspective absolute inset-[16%]"
          >
            <div className="h-full animate-[sulu-float_7s_ease-in-out_infinite]">
              <Tilt max={12} lift={40} className="h-full rounded-[28px]">
                <img
                  src={heroImg}
                  alt={hero.imageAlt}
                  width={1024}
                  height={1024}
                  fetchPriority="high"
                  className="size-full rounded-[28px] border-4 border-card object-cover shadow-[0_40px_80px_-30px_rgba(6,46,34,0.55)]"
                />
              </Tilt>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes sulu-float{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-14px) rotate(1deg)}}`}</style>
    </section>
  )
}
