import * as React from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false
  )
  React.useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  )
  React.useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [query])
  return match
}
