import { ArrowRightIcon } from "lucide-react"
import { ChapterHead } from "@/components/sulu/chapter"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { Tilt } from "@/components/sulu/tilt"
import { SuluIcon } from "@/components/sulu/icon"
import { requestDemo } from "@/lib/plan"
import { who } from "@/content"

export function Who() {
  return (
    <section id="who" className="scroll-mt-16 pb-24 md:pb-32">
      <div className="container-sulu">
        <ChapterHead n={3} caption="Для кого" title={who.title} lead={who.lead} />
        <RevealGroup className="grid border-t rule-strong sm:grid-cols-2 lg:grid-cols-4">
          {who.items.map((it) => (
            <RevealItem key={it.title} className="h-full border-b sm:[&:nth-child(even)]:border-l lg:border-b-0 lg:[&:not(:first-child)]:border-l">
              <Tilt max={8} className="h-full">
                {/* The original card pre-fills the plan in the demo form and scrolls to it. */}
                <button
                  type="button"
                  onClick={() => requestDemo(it.plan)}
                  aria-label={`${it.title}. Тариф ${it.plan}. Записаться на демо`}
                  className="group preserve-3d flex h-full w-full flex-col gap-4 bg-background px-6 pt-6 pb-8 text-left transition-colors duration-[var(--duration-medium)] hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                  <SuluIcon name={it.icon} className="size-7 text-primary" />
                  <span className="text-[22px] leading-tight font-bold tracking-tight" style={{ transform: "translateZ(24px)" }}>
                    {it.title}
                  </span>
                  <span className="flex-1 text-base text-muted-foreground">{it.text}</span>
                  <span className="flex items-center justify-between border-t pt-3 text-[13px] font-medium">
                    <span>
                      Тариф: <b className="text-primary">{it.plan}</b>
                    </span>
                    <ArrowRightIcon aria-hidden className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" />
                  </span>
                </button>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
