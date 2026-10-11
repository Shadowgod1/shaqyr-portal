import * as React from "react"
import { motion } from "motion/react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { STYLES, useSuluStyle, type SuluStyle } from "@/hooks/use-style"
import { SITE, nav } from "@/content"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex shrink-0 items-center gap-2.5 font-heading text-xl font-bold tracking-tight", className)}>
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-7" />
      SuluSystems
    </a>
  )
}

export function StyleSwitcher({ className, size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const { style, setStyle } = useSuluStyle()
  return (
    <ToggleGroup
      type="single"
      value={style}
      onValueChange={(v) => v && setStyle(v as SuluStyle)}
      variant="outline"
      size={size === "lg" ? "lg" : "default"}
      aria-label="Стиль оформления"
      className={className}
    >
      {STYLES.map((s) => (
        <ToggleGroupItem key={s.value} value={s.value} title={s.hint} aria-label={`${s.label}: ${s.hint}`}>
          {s.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function Header() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  return (
    <motion.header
      // Original: initial {y:-12, opacity:0} → spring (damping 22, stiffness 320)
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { type: "spring", damping: 22, stiffness: 320 } }}
      className={cn("sticky top-0 z-40 border-b rule-strong bg-background transition-shadow duration-[var(--duration-medium)]", scrolled && "shadow-[0_10px_30px_-24px_rgba(6,46,34,0.5)]")}
    >
      <div className="container-sulu flex h-16 items-center gap-10">
        <Logo />
        <nav aria-label="Разделы" className="hidden items-center gap-7 text-[15px] lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-[color:var(--kicker)]">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <StyleSwitcher />
          <a href={`${SITE}/login`} className="text-[15px] transition-colors hover:text-[color:var(--kicker)]">
            Вход
          </a>
          <Button asChild size="lg">
            <a href={`${SITE}/signup`}>Попробовать бесплатно</a>
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-lg" className="ml-auto lg:hidden" aria-label="Открыть меню">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <SheetDescription className="sr-only">Навигация по сайту</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 font-heading text-2xl font-medium hover:bg-muted">
                  {n.label}
                </a>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col gap-3 px-4">
              <span className="text-sm text-muted-foreground">Стиль оформления</span>
              <StyleSwitcher size="lg" className="w-full" />
            </div>
            <div className="mt-auto flex flex-col gap-2 p-4">
              <Button asChild variant="outline" size="xl">
                <a href={`${SITE}/login`}>Вход</a>
              </Button>
              <Button asChild size="xl">
                <a href={`${SITE}/signup`}>Попробовать бесплатно</a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
