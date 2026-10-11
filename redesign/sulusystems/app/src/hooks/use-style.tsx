import * as React from "react"

export type SuluStyle = "classic" | "night" | "clinic"

export const STYLES: { value: SuluStyle; label: string; hint: string }[] = [
  { value: "classic", label: "Классика", hint: "Кремовый фон и изумруд — как на текущем сайте" },
  { value: "night", label: "Ночь", hint: "Изумрудная ночь: тёмный изумруд, кремовый текст, золото" },
  { value: "clinic", label: "Клиника", hint: "Белый клинический фон, изумруд и мята" },
]

const KEY = "sulu-style"
const Ctx = React.createContext<{ style: SuluStyle; setStyle: (s: SuluStyle) => void }>({
  style: "classic",
  setStyle: () => {},
})

function readStored(): SuluStyle {
  try {
    const v = localStorage.getItem(KEY)
    if (v === "classic" || v === "night" || v === "clinic") return v
  } catch {
    /* storage unavailable */
  }
  return "classic"
}

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = React.useState<SuluStyle>(readStored)

  React.useEffect(() => {
    document.documentElement.dataset.style = style
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute("content", style === "night" ? "#002318" : style === "clinic" ? "#ffffff" : "#064E3B")
  }, [style])

  const setStyle = React.useCallback((s: SuluStyle) => {
    setStyleState(s)
    try {
      localStorage.setItem(KEY, s)
    } catch {
      /* storage unavailable */
    }
  }, [])

  return <Ctx.Provider value={{ style, setStyle }}>{children}</Ctx.Provider>
}

export const useSuluStyle = () => React.useContext(Ctx)

/** Palette per style, for the WebGL scenes (they can't read CSS variables). */
export const SCENE_COLORS: Record<SuluStyle, { body: string; deep: string; rim: string; gold: string; dust: string }> = {
  classic: { body: "#173f33", deep: "#064e3b", rim: "#ebf4f0", gold: "#b8966e", dust: "#b8966e" },
  night: { body: "#176e57", deep: "#002318", rim: "#f8f5ef", gold: "#d4a05f", dust: "#ecbd84" },
  clinic: { body: "#064e3b", deep: "#173f33", rim: "#ebf4f0", gold: "#0f766e", dust: "#358870" },
}
