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
    <footer className="border-t rule-strong pt-12 pb-10 text-sm">
      <div className="container-sulu">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
            <Logo />
            <p className="text-muted-foreground">{footer.about}</p>
            <div className="flex flex-col gap-0.5 text-muted-foreground">
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
          {footer.columns.map((c, i) => (
            <div key={c.title} className={["col-span-6 md:col-span-2 md:col-start-6", "col-span-6 md:col-span-2 md:col-start-8", "col-span-12 md:col-span-3 md:col-start-10"][i]}>
              <p className="mb-3.5 text-[13px] font-bold">{c.title}</p>
              <ul className="flex flex-col gap-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="transition-colors hover:text-[color:var(--kicker)]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col justify-between gap-4 border-t pt-4 text-muted-foreground md:flex-row md:items-center">
          <span>{footer.copyright}</span>
          <div className="flex flex-wrap items-center gap-3">
            {PAY.map((p) => (
              <img key={p.alt} src={p.src} alt={p.alt} className="h-7 w-auto border bg-white px-1.5 py-1" loading="lazy" />
            ))}
          </div>
          <span>{footer.made}</span>
        </div>
      </div>
    </footer>
  )
}
