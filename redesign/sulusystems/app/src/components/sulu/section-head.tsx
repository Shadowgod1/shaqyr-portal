import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"

export function SectionHead({ kicker, title, lead, className, align = "center" }: {
  kicker?: string; title: React.ReactNode; lead?: React.ReactNode; className?: string; align?: "center" | "left"
}) {
  return (
    <Reveal className={cn("mb-12 flex flex-col gap-4 md:mb-16", align === "center" ? "items-center text-center" : "items-start", className)}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2 className="max-w-3xl text-3xl leading-[1.12] font-semibold tracking-tight md:text-[2.75rem]">{title}</h2>
      {lead && <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{lead}</p>}
    </Reveal>
  )
}
