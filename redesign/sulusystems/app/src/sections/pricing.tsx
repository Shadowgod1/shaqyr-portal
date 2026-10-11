import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChapterHead } from "@/components/sulu/chapter"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { Tilt } from "@/components/sulu/tilt"
import { SuluIcon } from "@/components/sulu/icon"
import { requestDemo } from "@/lib/plan"
import { pricing } from "@/content"
import { cn } from "@/lib/utils"

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 pb-24 md:pb-32">
      <div className="container-sulu">
        <ChapterHead n={7} caption="Тарифы" title={pricing.title} lead={pricing.lead} />
        <p className="mb-3 text-sm text-muted-foreground lg:hidden">{pricing.swipe}</p>
        <RevealGroup className="-mx-4 flex snap-x snap-mandatory overflow-x-auto border-t rule-strong px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0" style={{ perspective: 1600 }}>
          {pricing.plans.map((p) => (
            <RevealItem key={p.name} className="w-[85%] shrink-0 snap-start border-r border-b sm:w-[48%] lg:w-auto lg:first:border-l">
              <Tilt max={5} scale={1} className="h-full">
                <article className="relative flex h-full flex-col bg-background px-6 pt-7 pb-7">
                  {p.hit && <span aria-hidden className="absolute -inset-x-px -top-px h-1.5 bg-primary" />}
                  <span className="min-h-[18px] text-[13px] font-bold text-[color:var(--kicker)]">{p.tag}</span>
                  <div className="mt-2 flex items-center gap-2">
                    <SuluIcon name={p.icon} className="size-5 text-primary" />
                    <h3 className="text-2xl">{p.name}</h3>
                  </div>
                  <p className="mt-2 min-h-[44px] text-[15px] text-muted-foreground">{p.for}</p>
                  <div className={cn("mt-7 leading-none font-bold whitespace-nowrap", p.price.length > 8 ? "text-[2rem] tracking-[-0.03em]" : "text-[3.2rem] tracking-[-0.05em]")}>{p.price}</div>
                  <p className="mt-2 min-h-[40px] text-sm text-muted-foreground">
                    {p.period}
                    {p.extra && <> · {p.extra}</>}
                  </p>
                  <ul className="mt-5 flex-1 border-t rule-strong">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 border-b py-2.5 text-[15px]">
                        <CheckIcon aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.href === "#form" ? (
                    <Button size="xl" variant="outline" className="mt-7 w-full border-[color:var(--rule-strong)]" onClick={() => requestDemo("Enterprise")}>
                      {p.cta}
                    </Button>
                  ) : (
                    <Button asChild size="xl" variant={p.hit ? "default" : "outline"} className={cn("mt-7 w-full", !p.hit && "border-[color:var(--rule-strong)]")}>
                      <a href={p.href}>{p.cta}</a>
                    </Button>
                  )}
                </article>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-[15px] text-muted-foreground">
          {pricing.yearly}{" "}
          <a href="#faq" className="font-medium text-foreground underline underline-offset-4">
            {pricing.compare}
          </a>
        </p>
      </div>
    </section>
  )
}
