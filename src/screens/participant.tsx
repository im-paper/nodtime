import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  Clock01Icon,
  UserGroupIcon,
  Tick02Icon,
  ArrowRight01Icon,
  CalendarCheckIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { BrowserFrame, ParticipantShell } from "@/components/mock/frames"
import { Avatar, RoleBadge, InfoBanner } from "@/components/mock/primitives"
import { AvailabilityOverview, GridLegend } from "@/components/mock/availability"
import { PEOPLE, REQUIRED, OPTIONAL, MEETING, WED_RESULT, type Person } from "@/data/meeting"

const ME = PEOPLE[1] // 참여자 시점 페르소나: 서연 (필참)

/* ---------------------------------------------------------- */
/* 7. 초대 알림                                                  */
/* ---------------------------------------------------------- */

export function Screen07Invited() {
  return (
    <BrowserFrame url={MEETING.inviteUrl}>
      <ParticipantShell active="invited">
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-3 flex -space-x-1.5">
              <Avatar person={PEOPLE[0]} size="lg" className="ring-2 ring-card" />
              <Avatar person={ME} size="lg" className="ring-2 ring-card" />
            </div>
            <h1 className="text-base font-bold">
              {MEETING.organizer}님이 {ME.name}님을 회의에 초대했어요
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              아래 내용을 확인해 주세요. 따로 입력할 건 없어요.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-muted/60 p-4 text-sm">
            <div className="font-semibold">{MEETING.title}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
              {MEETING.periodLabel} 중
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
              소요 시간 {MEETING.duration}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
              필참 {REQUIRED.length}명 · 선참 {OPTIONAL.length}명
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border px-4 py-3">
            <span className="text-xs text-muted-foreground">내 역할</span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              {ME.name} <RoleBadge role={ME.role} />
            </span>
          </div>

          <div className="mt-3">
            <InfoBanner>
              마이페이지에 설정해둔 비선호 시간이 자동으로 반영돼요. 이 회의를
              위해 다시 입력하지 않아도 괜찮아요.
            </InfoBanner>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button size="xl" className="w-full">
              확인했어요
            </Button>
            <Button variant="ghost" size="xl" className="w-full">
              참석자 목록 보기
              <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </ParticipantShell>
    </BrowserFrame>
  )
}

/* ---------------------------------------------------------- */
/* 8. 참석자 목록 보기 — 주최자의 "참여자 초대" 화면과 같은 구성:      */
/*    역할별 명단 + 전원 가용성 개요를 한 화면에서, 읽기 전용으로       */
/* ---------------------------------------------------------- */

function MemberGroup({ label, people }: { label: string; people: Person[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted-foreground">{people.length}명</span>
      </div>
      <div className="flex flex-col divide-y rounded-xl border bg-card">
        {people.map((p) => {
          const isOrganizer = p.id === "wade"
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
              <Avatar person={p} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {p.name}
                  {isOrganizer && (
                    <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
                      주최자
                    </span>
                  )}
                  {p.id === ME.id && (
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (나)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">{p.title}</div>
              </div>
              <RoleBadge role={p.role} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Screen08Members() {
  return (
    <BrowserFrame url={`${MEETING.inviteUrl}/members`}>
      <ParticipantShell active="members">
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="text-base font-bold">참석자 {PEOPLE.length}명</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {MEETING.title} · 주최 {MEETING.organizer}
          </p>

          <div className="mt-4 flex flex-col gap-4">
            <MemberGroup label="필참 · 반드시 참석" people={REQUIRED} />
            <MemberGroup label="선참 · 가능하면 참석" people={OPTIONAL} />
          </div>

          {/* 전원 가용성 개요 — 주최자 "참여자 초대" 화면과 동일한 그리드·톤 */}
          <div className="mt-5 rounded-2xl border bg-muted/40 p-4 dark:bg-muted/25">
            <div className="text-sm font-semibold">가능한 시간 한눈에 보기</div>
            <p className="mt-0.5 mb-3 text-[11px] text-muted-foreground">
              필참·선참 전체의 일정이에요. 읽기 전용이라 수정할 순 없어요.
            </p>
            <AvailabilityOverview />
            <div className="mt-3">
              <GridLegend />
            </div>
          </div>

          <div className="mt-3">
            <InfoBanner>
              필참자의 일정을 먼저 맞추고, 선참자의 일정은 그다음에 고려해요.
              최종 시간은 주최자 {MEETING.organizer}님이 추천 결과에서 확정해요.
            </InfoBanner>
          </div>
        </div>
      </ParticipantShell>
    </BrowserFrame>
  )
}

/* ---------------------------------------------------------- */
/* 10. 회의 결과 보기                                             */
/* ---------------------------------------------------------- */

export function Screen10Result() {
  return (
    <BrowserFrame url={`${MEETING.inviteUrl}/result`}>
      <ParticipantShell active="result">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <HugeiconsIcon icon={CalendarCheckIcon} className="size-6" />
            </span>
            <h1 className="text-base font-bold">회의 시간이 확정됐어요</h1>
            <p className="mt-1 text-xs text-muted-foreground">{MEETING.title}</p>
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-500/10">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {WED_RESULT.day.full}
            </div>
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {WED_RESULT.time}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border px-4 py-3">
            <span className="text-xs text-muted-foreground">내 참석 상태</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
              참석 가능
            </span>
          </div>

          <div className="mt-3 rounded-xl border px-4 py-3">
            <div className="mb-2 text-xs text-muted-foreground">
              함께하는 사람
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {PEOPLE.map((p) => (
                  <Avatar
                    key={p.id}
                    person={p}
                    size="sm"
                    className="ring-2 ring-card"
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">
                필참 {REQUIRED.length}명 전원 + 선참{" "}
                {OPTIONAL.map((p) => p.name).join("·")}님 참석
              </span>
            </div>
          </div>

          <Button size="xl" className="mt-4 w-full">
            내 캘린더에서 보기
          </Button>
        </div>
      </ParticipantShell>
    </BrowserFrame>
  )
}
