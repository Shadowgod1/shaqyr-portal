import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionHead } from "@/components/sulu/section-head"
import { Reveal } from "@/components/sulu/reveal"
import { faq } from "@/content"

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="container-sulu max-w-3xl">
        <SectionHead title={faq.title} />
        <Reveal>
          <Accordion type="single" collapsible defaultValue="q0" className="rounded-3xl border bg-card px-5 md:px-7">
            {faq.items.map((it, i) => (
              <AccordionItem key={it.q} value={`q${i}`}>
                <AccordionTrigger className="py-5 text-left text-base font-medium md:text-[1.05rem]">{it.q}</AccordionTrigger>
                <AccordionContent className="text-[0.95rem] leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
