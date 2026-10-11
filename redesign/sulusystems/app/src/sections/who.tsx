import { ArrowRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHead } from "@/components/sulu/section-head"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { Tilt } from "@/components/sulu/tilt"
import { SuluIcon } from "@/components/sulu/icon"
import { requestDemo } from "@/lib/plan"
import { who } from "@/content"

export function Who() {
  return (
    <section id="who" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-sulu">
        <SectionHead title={who.title} lead={who.lead} />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {who.items.map((it) => (
            <RevealItem key={it.title} className="h-full">
              <Tilt className="h-full rounded-2xl">
                {/* The original card pre-fills the plan in the demo form and scrolls to it. */}
                <button
                  type="button"
                  onClick={() => requestDemo(it.plan)}
                  className="group block h-full w-full rounded-2xl text-left focus-visible:outline-none"
                  aria-label={`${it.title}. Тариф ${it.plan}. Записаться на демо`}
                >
                  <Card className="preserve-3d h-full transition-shadow duration-[var(--duration-medium)] group-hover:shadow-[0_30px_60px_-30px_var(--glow)] group-focus-visible:ring-3 group-focus-visible:ring-ring">
                    <CardHeader className="gap-4" style={{ transform: "translateZ(30px)" }}>
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                        <SuluIcon name={it.icon} className="size-6" />
                      </span>
                      <CardTitle className="font-heading text-xl leading-snug">{it.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-[0.95rem] leading-relaxed">{it.text}</CardDescription>
                    </CardContent>
                    <CardFooter className="justify-between" style={{ transform: "translateZ(20px)" }}>
                      <Badge variant="secondary">{it.plan}</Badge>
                      <ArrowRightIcon aria-hidden className="size-4 text-primary transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" />
                    </CardFooter>
                  </Card>
                </button>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
