// The original landing pre-selects a plan in the demo form when a "Кому подходит" card
// or the Enterprise CTA is used, then scrolls to #form. Same behaviour here.
export const PLAN_EVENT = "sulu:plan"

export function requestDemo(plan = "") {
  window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan }))
  document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })
}
