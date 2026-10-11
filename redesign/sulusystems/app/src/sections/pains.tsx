import * as React from "react"
import { RotateCwIcon, CheckCircle2Icon } from "lucide-react"
import { SectionHead } from "@/components/sulu/section-head"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { SuluIcon } from "@/components/sulu/icon"
import { pains } from "@/content"
import { cn } from "@/lib/utils"

/** Each pain is a 3D card: the problem on the front, the solution on the back. */
export function Pains() {
  return (
    <section id="pains" className="bg-surface py-20 md:py-28">
      <div className="container-sulu">
        <SectionHead title={pains.title} lead={pains.lead} />
        <RevealGroup className="grid gap-5 md:grid-cols-2">
          {pains.items.map((p) => (
            <RevealItem key={p.title}>
              <FlipCard item={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function FlipCard({ item }: { item: (typeof pains.items)[number] }) {
  const [flipped, setFlipped] = React.useState(false)
  return (
    <div className="group perspective h-full min-h-[260px]" style={{ perspective: 1400 }}>
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        className={cn(
          "preserve-3d relative grid h-full min-h-[260px] w-full rounded-3xl text-left transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] [@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* front: the problem */}
        <span className="backface-hidden col-start-1 row-start-1 flex flex-col gap-3 rounded-3xl border bg-card p-7">
          <span className="text-xs font-semibold tracking-wide text-destructive uppercase">{item.tag}</span>
          <span className="font-heading text-2xl leading-snug font-semibold">{item.title}</span>
          <span className="leading-relaxed text-muted-foreground">{item.text}</span>
          <span className="mt-auto flex items-center gap-2 text-sm font-medium text-primary">
            <RotateCwIcon aria-hidden className="size-4" />
            Решение:
          </span>
        </span>
        {/* back: the solution */}
        <span className="backface-hidden col-start-1 row-start-1 flex [transform:rotateY(180deg)] flex-col justify-center gap-4 rounded-3xl bg-primary p-7 text-primary-foreground">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/12">
            <SuluIcon name={item.icon} className="size-7" />
          </span>
          <span className="text-sm font-semibold tracking-wide uppercase opacity-80">Решение:</span>
          <span className="flex items-center gap-2 font-heading text-3xl leading-tight font-semibold">
            <CheckCircle2Icon aria-hidden className="size-7 shrink-0" />
            {item.solution}
          </span>
        </span>
      </button>
    </div>
  )
}
