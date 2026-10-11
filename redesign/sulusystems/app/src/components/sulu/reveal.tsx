import * as React from "react"
import { motion, type Variants } from "motion/react"

// Variants lifted from the original landing bundle (framer-motion):
// hidden {opacity:0, y:28} → visible {opacity:1, y:0, duration:.55, ease:"easeOut"},
// containers stagger children by .12 with .1 delay, viewport once.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

type Props = React.ComponentProps<typeof motion.div> & { as?: "div" | "section" | "ul" | "li" | "header" }

export function Reveal({ children, variants = fadeUp, ...props }: Props) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={variants} {...props}>
      {children}
    </motion.div>
  )
}

export function RevealGroup({ children, ...props }: Props) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} {...props}>
      {children}
    </motion.div>
  )
}

export const RevealItem = ({ children, ...props }: React.ComponentProps<typeof motion.div>) => (
  <motion.div variants={fadeUp} {...props}>
    {children}
  </motion.div>
)
