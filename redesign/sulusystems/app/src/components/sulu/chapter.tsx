import { motion } from "motion/react"
import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"

const TOTAL = 9

/**
 * Graduated "syringe" scale that opens every chapter (from the first layout):
 * minor tick every 8px, major every 80px; the gold fill runs to the chapter's
 * position in the page when it scrolls into view.
 */
export function Scale({ n, className }: { n: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative h-7 border-t rule-strong", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--rule-strong) 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, var(--rule-strong) 0 1px, transparent 1px 8px)",
        backgroundSize: "100% 18px, 100% 8px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.span
        className="absolute -top-px left-0 h-1 bg-gold"
        initial={{ width: 0 }}
        whileInView={{ width: `${(n / TOTAL) * 100}%` }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </div>
  )
}

/** Chapter head: scale, big folio number with caption, title on columns 3–9, lead on 3–8. */
export function ChapterHead({
  n,
  caption,
  title,
  lead,
  className,
}: {
  n: number
  caption: string
  title: React.ReactNode
  lead?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Scale n={n} />
      <Reveal className="grid-12 mb-12 items-start gap-y-5 pt-10 md:mb-16">
        <div className="folio col-span-12 flex items-baseline gap-4 text-6xl md:col-span-2 md:block md:text-[96px]">
          {String(n).padStart(2, "0")}
          <small className="block text-[13px] font-medium tracking-normal text-muted-foreground md:mt-4">{caption}</small>
        </div>
        <h2 className="col-span-12 text-[2rem] leading-[1.02] md:col-span-10 md:col-start-3 lg:col-span-7 lg:col-start-3 lg:text-[3.5rem]">{title}</h2>
        {lead && <p className="col-span-12 text-lg text-muted-foreground md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-3">{lead}</p>}
      </Reveal>
    </div>
  )
}
