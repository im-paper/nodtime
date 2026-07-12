import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  Home01Icon,
  Add01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { useScreenNav } from "@/screens/nav-context"

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
/* Nodtime — 공용 로고                                                  */
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

/* ------------------------------------------------------------------ */
/* 새 회의 마법사 — 좌측 내비를 유지한 채 단계만 전환                        */
/* ------------------------------------------------------------------ */

export type WizardStepId = "invite" | "setup" | "loading" | "result"

/** 단계 id → 클릭 시 이동할 카탈로그 화면 id. '회의 설정'은 항상 '후보 있음' 상태로 진입 */
const WIZARD_STEPS: { id: WizardStepId; label: string; target: string }[] = [
  { id: "invite", label: "참여자 초대", target: "invite" },
  { id: "setup", label: "회의 설정", target: "setup-ok" },
  { id: "loading", label: "최적 시간 찾는 중", target: "loading" },
  { id: "result", label: "추천 결과", target: "result" },
]

/** 상단 단계 표시 — 어느 단계든 클릭해서 자유롭게 이동 가능 */
function WizardStepper({ current }: { current: WizardStepId }) {
  const goTo = useScreenNav()
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.id === current)

  return (
    <div className="mb-5 flex items-center">
      {WIZARD_STEPS.map((s, i) => {
        const active = s.id === current
        const done = i < currentIndex
        return (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => goTo(s.target)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : done
                    ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums",
                  active
                    ? "bg-white/20"
                    : done
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20"
                      : "bg-muted"
                )}
              >
                {i + 1}
              </span>
              {s.label}
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <span className="mx-1 h-px w-4 shrink-0 bg-border" />
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * 새 회의 마법사 화면 셸 — 대시보드와 동일한 좌측 내비('새 회의' 항목이
 * 활성 표시)를 유지한 채, 우측 콘텐츠 영역에서 단계 표시 + 카드만 바뀐다.
 * 단계 표시를 클릭하면 어느 단계로든 자유롭게 이동할 수 있다.
 */
export function WizardScreen({
  step,
  title,
  subtitle,
  children,
  className,
}: {
  step: WizardStepId
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <OrganizerShell active="new">
      <WizardStepper current={step} />
      <div
        className={cn(
          "rounded-2xl border bg-card p-6 shadow-sm md:p-8",
          className
        )}
      >
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
    </OrganizerShell>
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

/** 사이드바 항목 → 카탈로그 화면 id. '새 회의'는 참여자 초대(마법사 1단계)로 진입한다 */
const NAV_TARGET_ID: Record<OrganizerNavKey, string> = {
  dashboard: "dashboard",
  new: "invite",
  settings: "settings",
}

function OrganizerNavLink({
  item,
  active,
}: {
  item: OrganizerNavItem
  active: boolean
}) {
  const goTo = useScreenNav()
  return (
    <button
      type="button"
      onClick={() => goTo(NAV_TARGET_ID[item.key])}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
        active
          ? "bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      <HugeiconsIcon icon={item.icon} className="size-4" />
      {item.label}
    </button>
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

/** 참여자용 셸 — 좌측 내비 없이 가운데 정렬된 카드. 너비를 제한하지 않아 프레임 전체를 채운다 */
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
