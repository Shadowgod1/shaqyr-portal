import { motion } from "motion/react"
import { CheckIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { lazy, Suspense, useEffect, useState } from "react"
import { Tilt } from "@/components/sulu/tilt"
import { Reveal, fadeUp, stagger } from "@/components/sulu/reveal"
import { cn } from "@/lib/utils"
import { SITE, hero } from "@/content"
import heroImg from "@/assets/sulu/hero-clinic-dashboard.webp"
import { requestDemo } from "@/lib/plan"

const HeroScene = lazy(() => import("@/three/hero-scene").then((m) => ({ default: m.HeroScene })))

export function Hero() {
  const [marked, setMarked] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMarked(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* visible 12-column grid, as in the first layout */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <div className="container-sulu h-full">
          <div className="grid-12 h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={cn("border-l", i === 11 && "border-r")} />
            ))}
          </div>
        </div>
      </div>

      <div className="container-sulu">
        <div className="grid-12 items-center gap-y-8 pt-14 md:pt-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 col-span-12 flex flex-col gap-7 lg:col-span-7">
            <motion.p variants={fadeUp} className="text-[13px] font-medium text-[color:var(--kicker)]">
              {hero.kicker}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-[2.6rem] leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[5.2rem]">
              {hero.titleLines[0]} {hero.titleLines[1]} {hero.titleLines[2]}{" "}
              <span
                className="box-decoration-clone bg-[linear-gradient(transparent_64%,color-mix(in_oklch,var(--sulu-gold)_45%,transparent)_64%,color-mix(in_oklch,var(--sulu-gold)_45%,transparent)_94%,transparent_94%)] bg-no-repeat text-primary transition-[background-size] delay-700 duration-[var(--duration-slow)] ease-[var(--ease-standard)]"
                style={{ backgroundSize: marked ? "100% 100%" : "0% 100%" }}
              >
                {hero.titleAccent}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-snug md:text-xl">
              {hero.lead}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <Button size="xl" onClick={() => requestDemo()}>
                {hero.ctaPrimary}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button asChild size="xl" variant="outline" className="border-[color:var(--rule-strong)]">
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

          {/* 3D scene + original photo, columns 8–12 */}
          <div className="relative col-span-12 mx-auto aspect-square w-full max-w-[520px] lg:col-span-5">
            <Suspense fallback={null}>
              <HeroScene className="absolute -inset-[18%] -z-10" />
            </Suspense>
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: -22 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
              transition={{ delay: 0.35, duration: 1.1, ease: [0.24, 1, 0.4, 1] }}
              className="perspective absolute inset-x-[4%] inset-y-[21%]"
            >
              <div className="h-full animate-[sulu-float_7s_ease-in-out_infinite]">
                <Tilt max={12} lift={40} className="h-full">
                  <img
                    src={heroImg}
                    alt={hero.imageAlt}
                    width={1536}
                    height={1024}
                    fetchPriority="high"
                    className="size-full border border-[color:var(--rule-strong)] object-cover shadow-[0_40px_80px_-30px_rgba(6,46,34,0.55)]"
                  />
                </Tilt>
              </div>
            </motion.div>
          </div>
        </div>

        {/* measure row: the 0,1 ml numeral */}
        <div className="grid-12 mt-16 items-end border-t rule-strong md:mt-20">
          <Reveal className="folio col-span-12 pt-6 text-[34vw] leading-[0.9] tracking-[-0.07em] md:col-span-7 md:text-[22vw] xl:text-[300px]" aria-hidden>
            0<span className="text-gold">,</span>1
          </Reveal>
          <Reveal className="col-span-12 border-t pt-5 pb-8 md:col-span-4 md:col-start-9 md:border-0 md:pb-[6%]">
            <b className="mb-2 block text-[15px]">мл — шаг списания препаратов</b>
            <span className="text-[17px] text-muted-foreground">
              Ботулотоксины, филлеры и расходники списываются по техкартам. Себестоимость каждой услуги видна в реальном времени.
            </span>
          </Reveal>
        </div>
      </div>
      <style>{`@keyframes sulu-float{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-14px) rotate(1deg)}}`}</style>
    </section>
  )
}
