import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  Home01Icon,
  Add01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

/** 브라우저 창 목업 — 신호등 버튼 + 주소창 */
export function BrowserFrame({
  url,
  children,
}: {
  url: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
      <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-400/80" />
          <span className="size-3 rounded-full bg-amber-400/80" />
          <span className="size-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex h-7 flex-1 items-center gap-1.5 rounded-lg bg-background px-3 text-xs text-muted-foreground">
          <span className="text-emerald-600 dark:text-emerald-400">🔒</span>
          <span className="truncate">{url}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Nodtime — 새 회의 마법사 셸 (사이드바 없이 집중형 카드)                    */
/* ------------------------------------------------------------------ */

/** 검은 사각형 로고 + Nodtime */
export function NodtimeLogo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex items-center justify-center rounded-[9px] bg-slate-900 text-white dark:bg-white dark:text-slate-900",
          size === "sm" ? "size-7" : "size-8"
        )}
      >
        <HugeiconsIcon
          icon={Calendar03Icon}
          className={size === "sm" ? "size-4" : "size-4.5"}
        />
      </span>
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "sm" ? "text-[15px]" : "text-[17px]"
        )}
      >
        Nodtime
      </span>
    </div>
  )
}

/**
 * 마법사/대시보드 공통 카드.
 * step 문자열("2 / 4")을 주면 우상단에 단계 표기, 아니면 right 슬롯을 노출.
 */
export function NodtimeScreen({
  step,
  right,
  title,
  subtitle,
  children,
  className,
}: {
  step?: string
  right?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_10px_34px_-14px_rgb(2_6_23/0.18)]">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <NodtimeLogo />
        {right ??
          (step && (
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
              {step}
            </span>
          ))}
      </header>
      <div className={cn("p-6 md:p-8", className)}>
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 주최자 화면용 셸 — 좌측 고정 내비 (대시보드 · 설정 화면에서 사용)             */
/* ------------------------------------------------------------------ */

export type OrganizerNavKey = "dashboard" | "new" | "settings"

type OrganizerNavItem = {
  key: OrganizerNavKey
  label: string
  icon: typeof Home01Icon
}

const ORGANIZER_NAV_MAIN: OrganizerNavItem[] = [
  { key: "dashboard", label: "대시보드", icon: Home01Icon },
  { key: "new", label: "새 회의", icon: Add01Icon },
]

const ORGANIZER_NAV_SETTINGS: OrganizerNavItem = {
  key: "settings",
  label: "설정",
  icon: Settings01Icon,
}

function OrganizerNavLink({
  item,
  active,
}: {
  item: OrganizerNavItem
  active: boolean
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]",
        active
          ? "bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
          : "text-muted-foreground"
      )}
    >
      <HugeiconsIcon icon={item.icon} className="size-4" />
      {item.label}
    </span>
  )
}

/**
 * 주최자용 좌측 내비 셸 — 대시보드 · 새 회의(진입) · 설정.
 * '설정'은 클릭하면 비선호 시간·캘린더 연동 두 항목을 카드로 모아 보여주는 허브로 이동한다.
 */
export function OrganizerShell({
  active,
  children,
}: {
  active: OrganizerNavKey
  children: ReactNode
}) {
  return (
    <div className="flex overflow-hidden rounded-2xl border bg-card shadow-[0_10px_34px_-14px_rgb(2_6_23/0.18)]">
      <aside className="flex min-h-140 w-52 shrink-0 flex-col border-r bg-sidebar py-4">
        <div className="px-4 pb-4">
          <NodtimeLogo size="sm" />
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {ORGANIZER_NAV_MAIN.map((item) => (
            <OrganizerNavLink
              key={item.key}
              item={item}
              active={item.key === active}
            />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col gap-0.5 border-t px-2 pt-2">
          <OrganizerNavLink
            item={ORGANIZER_NAV_SETTINGS}
            active={active === "settings"}
          />
        </nav>
      </aside>
      <div className="min-w-0 flex-1 overflow-x-auto bg-muted/30 p-6">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 참여자 화면용 셸                                                     */
/* ------------------------------------------------------------------ */

/** 참여자용 셸 — 좌측 내비 없이 가운데 정렬된 카드. 너비를 제한하지 않아 주최자 화면(NodtimeScreen)과 동일하게 프레임 전체를 채운다 */
export function ParticipantShell({
  children,
  width,
}: {
  children: ReactNode
  width?: string
}) {
  return (
    <div className="flex min-h-150 flex-col items-center bg-muted/40 px-6 py-10">
      <div className="mb-6">
        <NodtimeLogo size="sm" />
      </div>
      <div className={cn("w-full", width)}>{children}</div>
    </div>
  )
}
