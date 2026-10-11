import { PhoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/sulu/reveal"
import { lazy, Suspense } from "react"
import { requestDemo } from "@/lib/plan"
import { offer } from "@/content"

const LogoScene = lazy(() => import("@/three/logo-scene").then((m) => ({ default: m.LogoScene })))

export function Offer() {
  return (
    <section id="offer" className="py-20 md:py-28">
      <div className="container-sulu">
        <Reveal className="grain relative grid items-center gap-6 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#173f33,#064e3b)] p-8 text-[#f8f5ef] md:grid-cols-[1.3fr_1fr] md:p-14">
          <div className="relative z-10 flex flex-col items-start gap-5">
            <h2 className="text-3xl leading-tight font-semibold md:text-[2.6rem]">
              {offer.title[0]}
              <br />
              {offer.title[1]}
            </h2>
            <p className="max-w-lg text-[#f8f5ef]/85 md:text-lg">{offer.lead}</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {/* Both buttons scroll to the demo form, as on the original. */}
              <Button size="xl" onClick={() => requestDemo()} className="bg-[#f8f5ef] text-[#173f33] hover:bg-white">
                {offer.primary}
              </Button>
              <Button size="xl" variant="outline" onClick={() => requestDemo()} className="border-[#f8f5ef]/70 bg-white/15 text-white hover:bg-white/25 hover:text-white">
                <PhoneIcon data-icon="inline-start" />
                {offer.secondary}
              </Button>
            </div>
          </div>
          <Suspense fallback={<div className="relative mx-auto aspect-square w-full max-w-[220px] md:max-w-[320px]" />}>
            <LogoScene label="Знак SuluSystems" className="relative mx-auto aspect-square w-full max-w-[220px] md:max-w-[320px]" />
          </Suspense>
        </Reveal>
      </div>
    </section>
  )
}
