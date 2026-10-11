import { CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHead } from "@/components/sulu/section-head"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { Tilt } from "@/components/sulu/tilt"
import { SuluIcon } from "@/components/sulu/icon"
import { requestDemo } from "@/lib/plan"
import { pricing } from "@/content"
import { cn } from "@/lib/utils"

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-sulu">
        <SectionHead title={pricing.title} lead={pricing.lead} />
        <p className="-mt-8 mb-6 text-center text-sm text-muted-foreground lg:hidden">{pricing.swipe}</p>
        <RevealGroup className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-6 pb-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0" style={{ perspective: 1600 }}>
          {pricing.plans.map((p) => (
            <RevealItem key={p.name} className="w-[82%] shrink-0 snap-center sm:w-[46%] lg:w-auto">
              <Tilt max={6} scale={1} className={cn("h-full rounded-3xl", p.hit && "lg:-mt-4")}>
                <Card
                  className={cn(
                    "relative h-full overflow-visible rounded-3xl",
                    p.hit && "ring-2 ring-primary shadow-[0_40px_80px_-30px_var(--glow)]"
                  )}
                >
                  {p.tag && (
                    <Badge className={cn("absolute -top-3 left-6 h-6 px-3 text-[0.7rem] tracking-wider", !p.hit && "bg-secondary text-secondary-foreground")}>
                      {p.tag}
                    </Badge>
                  )}
                  <CardHeader className="gap-3 pt-2">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground" title={p.emoji}>
                      <SuluIcon name={p.icon} className="size-5" />
                    </span>
                    <CardTitle className="font-heading text-2xl">{p.name}</CardTitle>
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className={cn("font-semibold tracking-tight whitespace-nowrap", p.price.length > 8 ? "text-[1.7rem]" : "text-4xl")}>{p.price}</span>
                      <span className="text-sm text-muted-foreground">{p.period}</span>
                    </div>
                    <CardDescription>{p.for}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="flex flex-col gap-2.5 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col items-stretch gap-3">
                    {p.extra && <p className="text-center text-xs text-muted-foreground">{p.extra}</p>}
                    {p.href === "#form" ? (
                      <Button size="lg" variant={p.hit ? "default" : "outline"} onClick={() => requestDemo("Enterprise")}>
                        {p.cta}
                      </Button>
                    ) : (
                      <Button asChild size="lg" variant={p.hit ? "default" : "outline"}>
                        <a href={p.href}>{p.cta}</a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {pricing.yearly}{" "}
          <a href="#faq" className="font-medium text-primary underline-offset-4 hover:underline">
            {pricing.compare}
          </a>
        </p>
      </div>
    </section>
  )
}
