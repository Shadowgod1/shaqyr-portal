import { PhoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/sulu/reveal"
import { lazy, Suspense } from "react"
import { requestDemo } from "@/lib/plan"
import { offer } from "@/content"

const LogoScene = lazy(() => import("@/three/logo-scene").then((m) => ({ default: m.LogoScene })))

export function OfferPanel() {
  return (
    <Reveal className="flex h-full flex-col gap-6 border-t-[6px] border-gold pt-7">
      <h3 className="text-[1.75rem] leading-[1.05] md:text-[2.4rem]">{offer.lead}</h3>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Both buttons scroll to the demo form, as on the original. */}
        <Button size="xl" onClick={() => requestDemo()}>
          {offer.primary}
        </Button>
        <Button size="xl" variant="outline" className="border-[color:var(--rule-strong)]" onClick={() => requestDemo()}>
          <PhoneIcon data-icon="inline-start" />
          {offer.secondary}
        </Button>
      </div>
      <Suspense fallback={<div className="aspect-square w-full max-w-[260px]" />}>
        <LogoScene label="Знак SuluSystems" className="relative aspect-square w-full max-w-[220px] md:max-w-[280px]" />
      </Suspense>
    </Reveal>
  )
}
