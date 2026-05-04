import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  Clock,
  Crown,
  Download,
  FileCheck,
  FileText,
  Gift,
  Handshake,
  Lock,
  LogOut,
  ShoppingCart,
  Sparkles,
  Zap,
} from 'lucide-react'

export const LANDING_ICON_REGISTRY: Record<string, LucideIcon> = {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  Clock,
  Crown,
  Download,
  FileCheck,
  FileText,
  Gift,
  Handshake,
  Lock,
  LogOut,
  ShoppingCart,
  Sparkles,
  Zap,
}

export function landingIconOrFallback(key: string): LucideIcon {
  return LANDING_ICON_REGISTRY[key] ?? AlertCircle
}
