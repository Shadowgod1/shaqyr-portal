import { Separator } from "@/components/ui/separator"
import { Logo } from "./header"
import { footer } from "@/content"
import visa from "@/assets/sulu/visa.png"
import mastercard from "@/assets/sulu/mastercard.png"
import visaSecure from "@/assets/sulu/visa-secure.png"
import mcIdCheck from "@/assets/sulu/mastercard-id-check.png"

const PAY = [
  { src: visa, alt: "Visa" },
  { src: mastercard, alt: "MasterCard" },
  { src: visaSecure, alt: "Visa Secure" },
  { src: mcIdCheck, alt: "Mastercard Identity Check" },
]

export function Footer() {
  return (
    <footer className="border-t bg-surface pt-14 pb-10 text-sm">
      <div className="container-sulu">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-muted-foreground">{footer.about}</p>
            <div className="flex flex-col gap-1 text-muted-foreground">
              <p>{footer.company}</p>
              <p>{footer.bin}</p>
              <p>{footer.address}</p>
              <p>
                Телефон: <a href={`tel:${footer.phone}`} className="hover:text-foreground">{footer.phone}</a>
              </p>
              <p>
                Email: <a href={`mailto:${footer.email}`} className="hover:text-foreground">{footer.email}</a>
              </p>
              <p>{footer.servers}</p>
            </div>
          </div>
          {footer.columns.map((c) => (
            <div key={c.title} className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-wider text-foreground uppercase">{c.title}</p>
              <ul className="flex flex-col gap-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {PAY.map((p) => (
              <img key={p.alt} src={p.src} alt={p.alt} className="h-8 w-auto rounded-md bg-white px-2 py-1" loading="lazy" />
            ))}
          </div>
          <div className="flex flex-col gap-1 text-muted-foreground md:items-end">
            <p>{footer.copyright}</p>
            <p>{footer.made}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
