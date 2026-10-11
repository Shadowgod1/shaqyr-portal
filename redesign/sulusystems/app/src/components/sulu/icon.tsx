import {
  Building2, FileText, Gift, HeartPulse, Landmark, Layers, MessageCircle, Package, ShieldCheck,
  Smartphone, Sparkles, Stethoscope, TrendingUp, Trophy, UserCheck, Zap, type LucideIcon,
} from "lucide-react"

// Same lucide glyphs the original landing renders, keyed by their lucide names.
const ICONS: Record<string, LucideIcon> = {
  "building-2": Building2, "file-text": FileText, gift: Gift, "heart-pulse": HeartPulse, landmark: Landmark,
  layers: Layers, "message-circle": MessageCircle, package: Package, "shield-check": ShieldCheck,
  smartphone: Smartphone, sparkles: Sparkles, stethoscope: Stethoscope, "trending-up": TrendingUp,
  trophy: Trophy, "user-check": UserCheck, zap: Zap,
}

export function SuluIcon({ name, className }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Sparkles
  return <I aria-hidden className={className} />
}
