import * as React from "react"
import { SendIcon, CircleCheckIcon, CircleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Reveal } from "@/components/sulu/reveal"
import { PLAN_EVENT } from "@/lib/plan"
import { form } from "@/content"

// Underlined fields, as in the first layout.
const UNDERLINE = "h-12 border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0.5 text-lg shadow-none focus-visible:border-b-2 focus-visible:border-gold focus-visible:ring-0 dark:bg-transparent"

type Lead = { name: string; phone: string; clinic: string; plan: string; website: string }
const EMPTY: Lead = { name: "", phone: "", clinic: "", plan: "", website: "" }

// "+7 (___) ___-__-__" mask, like the original phoneFormat helper.
function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "")
  if (d.startsWith("8")) d = "7" + d.slice(1)
  if (!d.startsWith("7")) d = "7" + d
  d = d.slice(0, 11)
  const p = d.slice(1)
  let out = "+7"
  if (p.length) out += " (" + p.slice(0, 3)
  if (p.length >= 3) out += ")"
  if (p.length > 3) out += " " + p.slice(3, 6)
  if (p.length > 6) out += "-" + p.slice(6, 8)
  if (p.length > 8) out += "-" + p.slice(8, 10)
  return out
}

export function LeadFormCard() {
  const [lead, setLead] = React.useState<Lead>(EMPTY)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    const on = (e: Event) => setLead((l) => ({ ...l, plan: (e as CustomEvent<string>).detail || "" }))
    window.addEventListener(PLAN_EVENT, on)
    return () => window.removeEventListener(PLAN_EVENT, on)
  }, [])

  // Same request as the original landing: POST /api/leads with {name, phone, clinic, plan, website}.
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      })
      const json = await res.json().catch(() => ({}))
      if (json.success) {
        setSent(true)
        setLead(EMPTY)
        window.setTimeout(() => setSent(false), 5000)
      } else {
        setError(form.errorServer)
      }
    } catch {
      setError(form.errorNetwork)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Reveal className="h-full">
      <form onSubmit={submit} className="relative flex h-full flex-col gap-6 border-t-[6px] border-foreground pt-7">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl">{form.title}</h3>
              <p className="text-muted-foreground">{form.lead}</p>
            </div>
            {/* honeypot, same as the original */}
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={lead.website}
              onChange={(e) => setLead({ ...lead, website: e.target.value })}
              style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
            />
            <FieldGroup>
              {lead.plan && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Тариф: <Badge variant="secondary">{lead.plan}</Badge>
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="lead-name">{form.name.label}</FieldLabel>
                <Input className={UNDERLINE} id="lead-name" name="name" required autoComplete="name" placeholder={form.name.placeholder} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="lead-phone">{form.phone.label}</FieldLabel>
                <Input
                  className={UNDERLINE}
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder={form.phone.placeholder}
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value ? formatPhone(e.target.value) : "" })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lead-clinic">{form.clinic.label}</FieldLabel>
                <Input className={UNDERLINE} id="lead-clinic" name="clinic" autoComplete="organization" placeholder={form.clinic.placeholder} value={lead.clinic} onChange={(e) => setLead({ ...lead, clinic: e.target.value })} />
              </Field>
              <Button type="submit" size="xl" disabled={busy || sent} className="h-auto min-h-12 w-full py-3 whitespace-normal">
                {sent ? form.success : form.submit}
                {!sent && <SendIcon data-icon="inline-end" />}
              </Button>
              <div aria-live="polite">
                {sent && (
                  <Alert>
                    <CircleCheckIcon />
                    <AlertDescription>{form.success}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </FieldGroup>
          </form>
    </Reveal>
  )
}
