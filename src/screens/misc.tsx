import { Fragment, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  Link01Icon,
  Clock01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OrganizerShell } from "@/components/mock/frames"
import { InfoBanner, SectionCard } from "@/components/mock/primitives"
import {
  DAYS,
  BLOCKS,
  DISLIKE_SLOTS,
  DISLIKE_MAX,
  type DayKey,
  type BlockKey,
} from "@/data/meeting"

/* ---------------------------------------------------------- */
/* 9. 설정 허브 — 비선호 시간 · 캘린더 연동으로 이어지는 진입 화면          */
/* ---------------------------------------------------------- */

function SettingsHubRow({
  icon,
  title,
  desc,
}: {
  icon: typeof Clock01Icon
  title: string
  desc: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50/60 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
        <HugeiconsIcon icon={icon} className="size-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        className="size-4 shrink-0 text-muted-foreground"
      />
    </div>
  )
}

export function Screen09Settings() {
  return (
    <OrganizerShell active="settings">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">설정</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            회의 추천에 반영되는 내 개인 설정이에요.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <SettingsHubRow
            icon={Clock01Icon}
            title="비선호 시간 설정"
            desc="불편한 시간대를 미리 등록해두면 모든 회의 추천에 자동으로 반영돼요"
          />
          <SettingsHubRow
            icon={Link01Icon}
            title="캘린더 연동 설정"
            desc="Google·Outlook 캘린더 연동 상태를 관리해요"
          />
        </div>
      </div>
    </OrganizerShell>
  )
}

/** 설정 하위 화면 상단의 뒤로가기 — '설정' 허브로 돌아가는 자리표시 */
function SettingsBackLink() {
  return (
    <button
      type="button"
      className="flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
      설정
    </button>
  )
}

/* ---------------------------------------------------------- */
/* 9a. 비선호 시간 설정 (마이페이지)                               */
/* ---------------------------------------------------------- */

/** 점심(12–13시)은 원래 선택 대상이 아니라, 오후1 구획은 13–15시로 표시한다 */
const BLOCK_DISPLAY: Record<BlockKey, { rowLabel: string; start: number; end: number }> = {
  am: { rowLabel: "09–12시", start: 9, end: 12 },
  aft1: { rowLabel: "13–15시", start: 13, end: 15 },
  aft2: { rowLabel: "15–18시", start: 15, end: 18 },
}

const DAY_FULL_NAME: Record<DayKey, string> = {
  mon: "월요일",
  tue: "화요일",
  wed: "수요일",
  thu: "목요일",
  fri: "금요일",
}

function slotKey(day: DayKey, block: BlockKey) {
  return `${day}-${block}`
}

/** 요일 × 시간대 그리드에서 눌러 고르는 비선호 시간 선택기 */
function DislikeTimeGrid() {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(DISLIKE_SLOTS.map((s) => slotKey(s.day, s.block)))
  )

  const toggle = (day: DayKey, block: BlockKey) => {
    const key = slotKey(day, block)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else if (next.size < DISLIKE_MAX) {
        next.add(key)
      }
      return next
    })
  }

  const selectedSlots = DAYS.flatMap((d) =>
    BLOCKS.filter((b) => selected.has(slotKey(d.key, b.key))).map((b) => ({
      day: d.key,
      block: b.key,
    }))
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          비워둬도 괜찮아요 · 최대 {DISLIKE_MAX}개까지
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
          {selected.size} / {DISLIKE_MAX}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-125 grid-cols-[5.5rem_repeat(5,1fr)] items-center gap-1.5">
          <div />
          {DAYS.map((d) => (
            <div
              key={d.key}
              className="pb-1 text-center text-xs font-semibold text-muted-foreground"
            >
              {d.label}
            </div>
          ))}
          {BLOCKS.map((b) => (
            <Fragment key={b.key}>
              <div className="text-xs text-muted-foreground">
                {BLOCK_DISPLAY[b.key].rowLabel}
              </div>
              {DAYS.map((d) => {
                const isOn = selected.has(slotKey(d.key, b.key))
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggle(d.key, b.key)}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                      isOn
                        ? "border-amber-300 bg-amber-200 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/30 dark:text-amber-200"
                        : "border-border bg-background text-muted-foreground/40 hover:border-amber-200 hover:text-amber-700 dark:hover:border-amber-400/30"
                    )}
                  >
                    {isOn ? "선택됨" : "–"}
                  </button>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        <div>
          <span className="text-muted-foreground">선택한 시간: </span>
          {selectedSlots.length > 0 ? (
            <span className="font-medium">
              {selectedSlots
                .map((s) => {
                  const d = BLOCK_DISPLAY[s.block]
                  return `${DAY_FULL_NAME[s.day]} ${String(d.start).padStart(2, "0")}:00 ~ ${String(d.end).padStart(2, "0")}:00`
                })
                .join(", ")}
            </span>
          ) : (
            <span className="text-muted-foreground/60">아직 없어요</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="size-3.5 shrink-0"
          />
          {selected.size < DISLIKE_MAX
            ? `${DISLIKE_MAX - selected.size}개 더 표시할 수 있어요. 정말 어쩔 수 없는 시간만 골라주세요.`
            : "최대 개수를 선택했어요."}
        </div>
      </div>
    </div>
  )
}

export function Screen11Dislike() {
  return (
    <OrganizerShell active="settings">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <SettingsBackLink />
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            불편한 시간이 있나요?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            선택 항목이에요. 정말 불편한 시간이 있을 때만 표시해 주세요.
            설정해두면 모든 회의 추천에 자동으로 반영돼요.
          </p>
        </div>

        <SectionCard>
          <DislikeTimeGrid />
        </SectionCard>

        <InfoBanner>
          비선호 시간은 하드 블록이 아니에요. 필참자 전원이 가능한 시간이 그
          시간대뿐이라면, 안내와 함께 추천될 수 있어요.
        </InfoBanner>

        <div className="flex flex-col gap-2">
          <Button size="sm" className="w-full">
            저장하고 완료
          </Button>
          <Button variant="ghost" size="sm" className="w-full">
            건너뛰기
          </Button>
        </div>
      </div>
    </OrganizerShell>
  )
}

/* ---------------------------------------------------------- */
/* 9b. 캘린더 연동 설정                                            */
/* ---------------------------------------------------------- */

export function Screen12Calendar() {
  return (
    <OrganizerShell active="settings">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <SettingsBackLink />
        <div>
          <h1 className="text-xl font-bold tracking-tight">캘린더 연동</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            연동하면 외근·연차·다른 회의가 자동으로 반영돼요.
          </p>
        </div>

        <SectionCard>
          <div className="flex flex-col divide-y">
            {/* Google — 연동됨 */}
            <div className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-sm font-bold">
                G
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Google Calendar</div>
                <div className="text-[11px] text-muted-foreground">
                  jihoon@nodtime.com · 5분 전 동기화됨
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <HugeiconsIcon icon={Tick02Icon} className="size-3" />
                연동됨
              </span>
            </div>

            {/* Outlook — 미연동 */}
            <div className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-sm font-bold">
                O
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Outlook Calendar</div>
                <div className="text-[11px] text-muted-foreground">
                  아직 연동하지 않았어요
                </div>
              </div>
              <Button variant="outline" size="xs">
                <HugeiconsIcon icon={Link01Icon} data-icon="inline-start" />
                연동하기
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="연동 범위">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Tick02Icon}
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
              />
              일정의 바쁨/한가함 상태만 읽어요 (제목·내용은 읽지 않아요)
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Tick02Icon}
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
              />
              회의가 확정되면 캘린더에 자동으로 일정을 추가해요
            </div>
          </div>
        </SectionCard>

        <InfoBanner>
          캘린더를 연동하지 않은 동료(예: D님)는 초대를 받으면 가능한 시간을
          직접 입력하는 방식으로 참여해요. 입력 전에는 주황색 <b>대기</b>{" "}
          상태로 표시돼요.
        </InfoBanner>
      </div>
    </OrganizerShell>
  )
}
