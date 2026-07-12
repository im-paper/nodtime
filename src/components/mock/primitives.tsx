import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { type Person, type Role } from "@/data/meeting"

export function Avatar({
  person,
  size = "md",
  variant = "solid",
  className,
}: {
  person: Person
  size?: "sm" | "md" | "lg"
  /** solid: 컬러 배경 + 흰 글자 / tint: 연파랑 배경 + 파란 글자 */
  variant?: "solid" | "tint"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none",
        variant === "solid"
          ? cn(person.color, "text-white")
          : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-8 text-xs",
        size === "lg" && "size-10 text-sm",
        className
      )}
    >
      {person.name.slice(0, 1)}
    </span>
  )
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        role === "필참"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      {role}
    </span>
  )
}

export function MeetingStatusBadge({ status }: { status: "조율 중" | "확정" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "확정"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
      )}
    >
      {status === "확정" && <HugeiconsIcon icon={Tick02Icon} className="size-3" />}
      {status}
    </span>
  )
}

/** 파랑 정보 배너 — 안내 문구용 */
export function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
      <HugeiconsIcon
        icon={InformationCircleIcon}
        className="mt-0.5 size-3.5 shrink-0"
      />
      <div>{children}</div>
    </div>
  )
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-[0_4px_20px_-8px_rgb(2_6_23/0.1)]",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
