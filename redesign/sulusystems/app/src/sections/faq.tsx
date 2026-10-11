import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChapterHead } from "@/components/sulu/chapter"
import { Reveal } from "@/components/sulu/reveal"
import { faq } from "@/content"

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-surface pb-24 md:pb-32">
      <div className="container-sulu">
        <ChapterHead n={8} caption="FAQ" title={faq.title} />
        <div className="grid-12">
          <Reveal className="col-span-12 lg:col-span-10 lg:col-start-3">
            <Accordion type="single" collapsible defaultValue="q0" className="border-t rule-strong">
              {faq.items.map((it, i) => (
                <AccordionItem key={it.q} value={`q${i}`}>
                  <AccordionTrigger className="py-6 text-left text-lg leading-snug font-medium tracking-tight hover:text-[color:var(--kicker)] hover:no-underline md:text-[21px]">
                    <span className="flex gap-4 md:gap-6">
                      <span className="w-9 shrink-0 pt-1 text-[15px] font-bold text-muted-foreground md:w-12">8.{i + 1}</span>
                      {it.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[820px] pl-13 text-base text-muted-foreground md:pl-18 md:text-[17px]">{it.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
