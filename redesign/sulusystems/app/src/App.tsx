import { Header } from "@/sections/header"
import { Hero } from "@/sections/hero"
import { ErpChain } from "@/sections/erp-chain"
import { AiAssistant } from "@/sections/ai-assistant"
import { Who } from "@/sections/who"
import { Pains } from "@/sections/pains"
import { Features } from "@/sections/features"
import { Demo } from "@/sections/demo"
import { Pricing } from "@/sections/pricing"
import { Faq } from "@/sections/faq"
import { Closing } from "@/sections/closing"
import { Footer } from "@/sections/footer"

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        К содержанию
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ErpChain />
        <AiAssistant />
        <Who />
        <Pains />
        <Features />
        <Demo />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
