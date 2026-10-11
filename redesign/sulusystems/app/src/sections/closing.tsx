import { ChapterHead } from "@/components/sulu/chapter"
import { OfferPanel } from "./offer"
import { LeadFormCard } from "./lead-form"
import { offer } from "@/content"

/** Final chapter (v1 "08 Начать"): free-start offer with the 3D mark, and the demo form. */
export function Closing() {
  return (
    <section id="form" className="scroll-mt-16 pb-24 md:pb-32">
      <div className="container-sulu">
        <ChapterHead n={9} caption="Начать" title={`${offer.title[0]} ${offer.title[1]}`} />
        <div className="grid-12 items-start gap-y-16">
          <div className="col-span-12 lg:col-span-6">
            <OfferPanel />
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <LeadFormCard />
          </div>
        </div>
      </div>
    </section>
  )
}
