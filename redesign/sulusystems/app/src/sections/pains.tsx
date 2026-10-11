import * as React from "react"
import { CheckCircle2Icon, RotateCwIcon } from "lucide-react"
import { ChapterHead } from "@/components/sulu/chapter"
import { RevealGroup, RevealItem } from "@/components/sulu/reveal"
import { SuluIcon } from "@/components/sulu/icon"
import { pains } from "@/content"
import { cn } from "@/lib/utils"

/** Each pain is a row of the Swiss table that flips in 3D to reveal its solution. */
export function Pains() {
  return (
    <section id="pains" className="bg-surface pb-24 md:pb-32">
      <div className="container-sulu">
        <ChapterHead n={4} caption="Четыре проблемы" title={pains.title} lead={pains.lead} />
        <RevealGroup className="border-t rule-strong">
          {pains.items.map((p) => (
            <RevealItem key={p.title} className="border-b rule-strong">
              <FlipRow item={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function FlipRow({ item }: { item: (typeof pains.items)[number] }) {
  const [flipped, setFlipped] = React.useState(false)
  const [kind, name] = item.tag.split(": ")
  return (
    <div className="group" style={{ perspective: 1600 }}>
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        className={cn(
          "preserve-3d relative grid w-full text-left transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] [@media(hover:hover)]:group-hover:[transform:rotateX(180deg)]",
          flipped && "[transform:rotateX(180deg)]"
        )}
      >
        {/* front: the problem, laid out as the v1 row (label · title · text) */}
        <span className="grid-12 backface-hidden col-start-1 row-start-1 items-baseline gap-y-3 bg-surface py-8">
          <span className="col-span-12 text-[15px] font-medium md:col-span-2">
            <span className="block text-[13px] font-normal text-destructive">{kind}</span>
            {name}
          </span>
          <span className="col-span-12 text-2xl leading-[1.05] font-bold tracking-tight md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-3 lg:text-4xl">
            {item.title}
          </span>
          <span className="col-span-12 flex flex-col gap-3 text-[17px] text-muted-foreground lg:col-span-4 lg:col-start-9">
            {item.text}
            <span className="flex items-center gap-2 text-sm font-medium text-primary">
              <RotateCwIcon aria-hidden className="size-4" />
              Решение:
            </span>
          </span>
        </span>
        {/* back: the solution */}
        <span className="grid-12 backface-hidden col-start-1 row-start-1 [transform:rotateX(180deg)] items-center bg-primary py-8 text-primary-foreground">
          <span className="col-span-12 flex items-center gap-3 text-[15px] font-medium md:col-span-2">
            <SuluIcon name={item.icon} className="size-6" />
            Решение:
          </span>
          <span className="col-span-12 flex items-center gap-3 text-2xl font-bold tracking-tight md:col-span-10 md:col-start-3 lg:text-4xl">
            <CheckCircle2Icon aria-hidden className="size-8 shrink-0" />
            {item.solution}
          </span>
        </span>
      </button>
    </div>
  )
}
