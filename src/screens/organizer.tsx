import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Search01Icon,
  Calendar03Icon,
  Clock01Icon,
  UserGroupIcon,
  Tick02Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  AlertCircleIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NodtimeScreen, OrganizerShell } from "@/components/mock/frames"
import { Avatar, RoleBadge } from "@/components/mock/primitives"
import { AvailabilityOverview, GridLegend } from "@/components/mock/availability"
import {
  PEOPLE,
  REQUIRED,
  OPTIONAL,
  MEETING,
  MEETING_LIST,
  CANDIDATES,
  WED_TIMES,
  LOADING,
  RESULT,
  PREVIEW,
  SETUP_FAIL,
  DAYS,
  MIN_REQUIRED,
  REC_HOUR,
  attendanceAt,
  ro,
  type Person,
  type Role,
} from "@/data/meeting"

/* ---------------------------------------------------------- */
/* 1. 대시보드 — 회의 목록                                        */
/* ---------------------------------------------------------- */

function StatusPill({ status }: { status: "조율 중" | "확정" }) {
  const confirmed = status === "확정"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        confirmed
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          confirmed ? "bg-emerald-500" : "bg-blue-500"
        )}
      />
      {status}
    </span>
  )
}

export function Screen01Dashboard() {
  return (
    <OrganizerShell active="dashboard">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">내 회의</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            내가 주최했거나 참여 중인 회의예요.
          </p>
        </div>
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          새 회의 만들기
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {MEETING_LIST.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-xl border bg-card px-5 py-4"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold">{m.title}</span>
                <StatusPill status={m.status} />
                {!m.mine && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    참여 중
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                {m.time ?? m.period}
                <span className="text-border">·</span>
                <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
                {m.people}
              </div>
            </div>
            <Button variant="outline" size="sm">
              {m.status === "조율 중" ? "결과 보기" : "상세"}
              <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
            </Button>
          </div>
        ))}
      </div>
    </OrganizerShell>
  )
}

/* ---------------------------------------------------------- */
/* 2. 참여자 초대 (1/4) — 필참/선참 토글 + 전원 가용성 개요           */
/* ---------------------------------------------------------- */

function PersonInviteRow({
  person,
  role,
  onRole,
}: {
  person: Person
  role: Role
  onRole: (role: Role) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
      <Avatar person={person} size="md" />
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className="text-sm font-semibold">{person.name}</span>
        {person.id === "wade" && (
          <span className="text-xs font-normal text-muted-foreground">(나)</span>
        )}
      </div>
      {/* 필참/선참 토글 */}
      <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5 text-xs">
        {(["필참", "선참"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRole(r)}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-colors",
              role === r
                ? "bg-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}

function InviteGroup({
  label,
  people,
  roles,
  setRole,
}: {
  label: string
  people: Person[]
  roles: Record<string, Role>
  setRole: (id: string, role: Role) => void
}) {
  if (people.length === 0) return null
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted-foreground">{people.length}명</span>
      </div>
      <div className="flex flex-col gap-2">
        {people.map((p) => (
          <PersonInviteRow
            key={p.id}
            person={p}
            role={roles[p.id]}
            onRole={(r) => setRole(p.id, r)}
          />
        ))}
      </div>
    </div>
  )
}

export function Screen02Invite() {
  const [roles, setRoles] = useState<Record<string, Role>>(() =>
    Object.fromEntries(PEOPLE.map((p) => [p.id, p.role]))
  )

  const required = PEOPLE.filter((p) => roles[p.id] === "필참")
  const optional = PEOPLE.filter((p) => roles[p.id] === "선참")

  const setRole = (id: string, role: Role) =>
    setRoles((prev) => ({ ...prev, [id]: role }))

  return (
    <NodtimeScreen
      step="1 / 4"
      title="참여자 초대"
      subtitle="동료를 추가하고 필참·선참을 정하세요. 아래에서 전원 일정을 한눈에 볼 수 있어요."
    >
      <div className="flex flex-col gap-5">
        <div className="flex h-11 items-center gap-2.5 rounded-xl border bg-muted/40 px-4 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Search01Icon} className="size-4" />
          이름으로 동료 검색해서 추가…
        </div>

        <InviteGroup
          label="필참 · 반드시 참석"
          people={required}
          roles={roles}
          setRole={setRole}
        />
        <InviteGroup
          label="선참 · 가능하면 참석"
          people={optional}
          roles={roles}
          setRole={setRole}
        />

        {/* 전원 가용성 개요 — 한눈에 */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 text-sm font-semibold">참여자 가용성</div>
          <AvailabilityOverview roles={roles} />
          <div className="mt-3">
            <GridLegend />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm">
            다음 · 회의 설정
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </NodtimeScreen>
  )
}

/* ---------------------------------------------------------- */
/* 3. 회의 설정 (2/4) — 좌: 조건 · 우: 실시간 미리보기               */
/* ---------------------------------------------------------- */

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 text-[13px] font-medium text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  )
}

function MemberRow({ names, role }: { names: string; role: Role }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
      <span className="text-sm">{names}</span>
      <RoleBadge role={role} />
    </div>
  )
}

/**
 * 회의 설정 좌측 — 조건 입력 컬럼.
 * filled=false면 이름·기간·시간을 비운 기본(입력 전) 상태 (인원은 초대 단계에서 넘어옴).
 * canRecommend=false면 '추천 받기'를 비활성화하고, 왜 못 넘어가는지 힌트를 보여준다.
 */
function SetupConditions({
  filled = true,
  canRecommend = true,
  recommendHint,
}: {
  filled?: boolean
  canRecommend?: boolean
  recommendHint?: string
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold">회의 조건</h2>

      <Field label="회의 이름">
        <input
          readOnly
          value={filled ? MEETING.title : ""}
          placeholder="회의 이름을 입력하세요"
          className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/50"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="회의 기간">
          <div className="flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2.5 text-sm">
            <HugeiconsIcon
              icon={Calendar03Icon}
              className="size-4 text-muted-foreground"
            />
            {filled ? (
              "7/13 ~ 7/17"
            ) : (
              <span className="text-muted-foreground/50">기간 선택</span>
            )}
          </div>
        </Field>
        <Field label="회의 시간">
          <div className="flex items-center justify-between rounded-xl border bg-background px-3.5 py-2.5 text-sm">
            <span className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Clock01Icon}
                className="size-4 text-muted-foreground"
              />
              {filled ? (
                "1시간"
              ) : (
                <span className="text-muted-foreground/50">시간 선택</span>
              )}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className="size-4 text-muted-foreground"
            />
          </div>
        </Field>
      </div>

      <Field label="인원 확인">
        <div className="flex flex-col gap-2">
          <MemberRow
            names={REQUIRED.map((p) =>
              p.id === "wade" ? "지훈(나)" : p.name
            ).join(", ")}
            role="필참"
          />
          <MemberRow names={OPTIONAL.map((p) => p.name).join(", ")} role="선참" />
        </div>
      </Field>

      <div>
        {canRecommend ? (
          <Button size="sm">
            <HugeiconsIcon icon={SparklesIcon} data-icon="inline-start" />
            추천 받기
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Button>
        ) : (
          <>
            <Button size="sm" disabled>
              <HugeiconsIcon icon={SparklesIcon} data-icon="inline-start" />
              추천 받기
            </Button>
            {recommendHint && (
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {recommendHint}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* 미리보기 요일 스트립용 파생 데이터 — 모두 정적 */
const REQ_TOTAL = REQUIRED.length
/** 후보 있음: 요일별 참석 가능 필참 (14:00 기준) */
const OK_DAYS = DAYS.map((d) => ({
  label: d.label,
  ok: attendanceAt(d.key, REC_HOUR).ok,
}))
const OK_CHOSEN = OK_DAYS.find((d) => d.ok === REQ_TOTAL)
/** 성립 실패: 가장 많은 날의 참석 인원 */
const FAIL_MAX = Math.max(...SETUP_FAIL.perDay.map((p) => p.ok))

/** 성립 가능/불가 배지 */
function VerdictChip({ tone }: { tone: "ok" | "fail" }) {
  return tone === "ok" ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
      <HugeiconsIcon icon={Tick02Icon} className="size-3" />
      성립 가능
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
      <HugeiconsIcon icon={AlertCircleIcon} className="size-3" />
      성립 불가
    </span>
  )
}

/**
 * 요일별 참석 가능 필참을 미니 막대로. 점선은 정족수(최소 인원) 기준선.
 * ok 톤: 기준선 이상=초록(전원인 날은 강조), 미만=회색.
 * fail 톤: 전부 기준선 아래라 빨강.
 */
function DayStrip({
  days,
  total,
  threshold,
  tone,
}: {
  days: { label: string; ok: number }[]
  total: number
  threshold: number
  tone: "ok" | "fail"
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {days.map((d, i) => {
          const chosen = tone === "ok" && d.ok === total
          return (
            <span
              key={i}
              className={cn(
                "flex-1 text-center text-[11px] font-semibold tabular-nums",
                chosen
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {d.ok}
            </span>
          )
        })}
      </div>

      <div className="relative flex h-16 items-end gap-1.5">
        <div
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-muted-foreground/40"
          style={{ bottom: `${(threshold / total) * 100}%` }}
        >
          <span className="absolute -top-2 right-0 rounded bg-muted px-1 text-[9px] font-semibold text-muted-foreground">
            최소 {threshold}
          </span>
        </div>
        {days.map((d, i) => {
          const chosen = tone === "ok" && d.ok === total
          const meets = d.ok >= threshold
          return (
            <div key={i} className="flex h-full flex-1 items-end">
              <div
                className={cn(
                  "w-full rounded-t-lg",
                  tone === "fail"
                    ? "bg-red-400/80 dark:bg-red-500/45"
                    : chosen
                      ? "bg-emerald-500"
                      : meets
                        ? "bg-emerald-300 dark:bg-emerald-500/40"
                        : "bg-muted-foreground/20"
                )}
                style={{ height: `${(d.ok / total) * 100}%` }}
              />
            </div>
          )
        })}
      </div>

      <div className="flex gap-1.5">
        {days.map((d, i) => {
          const chosen = tone === "ok" && d.ok === total
          return (
            <span
              key={i}
              className={cn(
                "flex-1 text-center text-[11px]",
                chosen
                  ? "font-bold text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground/70"
              )}
            >
              {d.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 회의 설정 우측 — 실시간 미리보기.
 * empty=입력 전 빈 상태 / ok=후보 있음 / fail=성립 불가 (요일 스트립)
 */
function SetupPreview({
  state = "ok",
}: {
  state?: "empty" | "ok" | "fail"
}) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-5 dark:bg-muted/25">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">실시간 미리보기</h2>
        {state === "ok" && <VerdictChip tone="ok" />}
        {state === "fail" && <VerdictChip tone="fail" />}
      </div>

      {state === "empty" ? (
        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-xl border border-dashed bg-card/50 p-4">
            <div className="text-xs text-muted-foreground">
              현재 조건 기준 예상 후보
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums text-muted-foreground/40">
              —
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            기간·시간·인원을 정하면 여기에서 성립 가능성(예상 후보·전원 가능
            날)을 실시간으로 보여드려요.
          </p>
        </div>
      ) : state === "fail" ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold tabular-nums text-red-600 dark:text-red-400">
              {SETUP_FAIL.candidateCount}개
            </span>
            <span className="pb-1 text-[11px] text-muted-foreground">
              필참 최소 인원 {SETUP_FAIL.quorumLabel} 미충족
            </span>
          </div>

          <DayStrip
            days={SETUP_FAIL.perDay.map((p) => ({ label: p.day.label, ok: p.ok }))}
            total={SETUP_FAIL.requiredTotal}
            threshold={SETUP_FAIL.minRequired}
            tone="fail"
          />

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            가장 많은 날도{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              {FAIL_MAX}/{SETUP_FAIL.requiredTotal}
            </span>{" "}
            — 기준선(최소 {SETUP_FAIL.minRequired}명) 아래예요.
          </p>

          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="mt-0.5 size-4 shrink-0"
            />
            <span>
              아래 <span className="font-semibold">병목 원인</span>과{" "}
              <span className="font-semibold">해결 옵션</span>으로 조건을 바꿔
              보세요.
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold tabular-nums">
              {PREVIEW.candidateCount}개
            </span>
            <span className="pb-1 text-[11px] text-muted-foreground">
              예상 후보 · 필참 {REQ_TOTAL}명 기준
            </span>
          </div>

          <DayStrip
            days={OK_DAYS}
            total={REQ_TOTAL}
            threshold={MIN_REQUIRED}
            tone="ok"
          />

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            기준선(최소 {MIN_REQUIRED}명)을 넘는 날 중, 전원 가능한{" "}
            {OK_CHOSEN?.label}요일부터 우선 비교해요.
          </p>
        </div>
      )}
    </div>
  )
}

/** 기본 — 아직 이름·기간·시간을 입력하지 않아 미리보기가 비어 있는 진입 화면 */
export function Screen03SetupBase() {
  return (
    <NodtimeScreen step="2 / 4">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <SetupConditions
          filled={false}
          canRecommend={false}
          recommendHint="이름·기간·시간을 모두 정하면 추천받을 수 있어요."
        />
        <SetupPreview state="empty" />
      </div>
    </NodtimeScreen>
  )
}

/** 후보 있음 — 조건을 넣어 성립 가능성이 나온 상태 */
export function Screen03Setup() {
  return (
    <NodtimeScreen step="2 / 4">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <SetupConditions />
        <SetupPreview state="ok" />
      </div>
    </NodtimeScreen>
  )
}

/* ---------------------------------------------------------- */
/* 3b. 회의 성립 실패 — 병목 원인 + 해결 옵션                        */
/* ---------------------------------------------------------- */

/** 성립 실패 풀카드 — 왜 안 되는지(병목) + 어떻게 풀지(해결 옵션) */
function FormationFailCard() {
  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6">
      {/* 헤드라인 — 실패이되 바로 해결로 넘어가는 톤 */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-red-600 dark:text-red-400">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-6" />
        </span>
        <div>
          <h3 className="text-base font-bold">
            이 조건으로는 회의가 성립되지 않아요
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {SETUP_FAIL.summary} (필참 최소 인원 {SETUP_FAIL.quorumLabel})
          </p>
        </div>
      </div>

      {/* 병목 원인 */}
      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold">병목 원인</div>
        <div className="flex flex-col gap-2">
          {SETUP_FAIL.bottlenecks.map((b) => (
            <div
              key={b.person.id}
              className="flex items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3"
            >
              <span className="flex items-center gap-2.5">
                <Avatar person={b.person} size="sm" />
                <span className="text-sm font-semibold">{b.person.name}</span>
              </span>
              <span className="text-right text-xs text-muted-foreground">
                {b.cause}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 해결 옵션 — 실제로 성립되는 선택지만 */}
      <div className="mt-5">
        <div className="mb-2 text-sm font-semibold">해결 옵션</div>
        <div className="flex flex-col gap-2">
          {SETUP_FAIL.options.map((o) => (
            <button
              key={o.label}
              type="button"
              className="group flex w-full items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/60 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {o.expect}
                </span>
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Screen03bSetupFail() {
  return (
    <NodtimeScreen step="2 / 4">
      <div className="flex flex-col gap-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <SetupConditions
            canRecommend={false}
            recommendHint="지금 조건으론 성립하지 않아요. 아래 해결 옵션으로 조건을 먼저 바꿔 주세요."
          />
          <SetupPreview state="fail" />
        </div>
        <FormationFailCard />
      </div>
    </NodtimeScreen>
  )
}

/* ---------------------------------------------------------- */
/* 4. 로딩 (3/4) — 최적 시간을 찾는 중 · 비교 과정                   */
/* ---------------------------------------------------------- */

export function Screen04Loading() {
  return (
    <NodtimeScreen step="3 / 4">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <h1 className="text-xl font-bold">최적 시간을 찾는 중</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            왜 이 시간인지 알 수 있도록, 비교 과정을 그대로 보여드려요.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          {LOADING.prefilters.map((f) => (
            <div key={f.title} className="flex items-center gap-2.5 text-sm">
              <HugeiconsIcon
                icon={Tick02Icon}
                className="size-4 text-emerald-600 dark:text-emerald-400"
              />
              <span className="font-medium">{f.title}</span>
              <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                {f.note}
              </span>
            </div>
          ))}
        </div>

        <div className="my-5 border-t" />

        <div className="mb-3 text-sm font-semibold">우선순위 비교</div>
        <ol className="flex flex-col gap-2.5">
          {LOADING.criteria.map((c) => (
            <li key={c.no} className="flex items-center gap-2.5 text-sm">
              {c.fired ? (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-4 text-blue-600 dark:text-blue-400"
                />
              ) : (
                <span className="size-3.5 rounded-full border border-muted-foreground/40" />
              )}
              <span className={cn("font-medium", !c.fired && "text-muted-foreground")}>
                {c.no}. {c.title}
              </span>
              <span
                className={cn(
                  "ml-auto text-xs tabular-nums",
                  c.fired
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground/70"
                )}
              >
                {c.result}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {LOADING.summary}
        </p>
      </div>
    </NodtimeScreen>
  )
}

/* ---------------------------------------------------------- */
/* 5. 결과 (4/4) — 추천 일정 · 상황 안내 · 후보 비교                 */
/* ---------------------------------------------------------- */

export function Screen05Result() {
  const [showAlt, setShowAlt] = useState(false)
  const alt = CANDIDATES.find((c) => c.day.key === "thu")

  return (
    <NodtimeScreen step="4 / 4">
      <div className="flex flex-col gap-6">
        {/* 히어로 */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                추천 일정
              </div>
              <div className="mt-1 text-2xl font-bold">
                {RESULT.day.full} {RESULT.time}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  필참 {RESULT.attend.required} 전원 참석
                </span>
                <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-transparent dark:text-emerald-300">
                  가장 편한 시간
                </span>
              </div>
              <div className="mt-2 text-xs text-emerald-800/80 dark:text-emerald-300/80">
                전체 {RESULT.attend.total}명 중 {RESULT.attend.attending}명 참석 · 선참
                유나는 이 시간 불가
              </div>
            </div>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <HugeiconsIcon icon={Tick02Icon} className="size-6" />
            </span>
          </div>
        </div>

        {/* 추천 이유 */}
        <section>
          <h3 className="mb-2 text-sm font-semibold">추천 이유</h3>
          <ul className="flex flex-col gap-1.5">
            {RESULT.reasons.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* 상황 안내 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
            <span>{RESULT.softNote}</span>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            <HugeiconsIcon icon={UserGroupIcon} className="mt-0.5 size-4 shrink-0" />
            <span>{RESULT.optionalNote}</span>
          </div>
        </div>

        {/* 요일 비교 — 왜 수요일 */}
        <section>
          <h3 className="mb-2 text-sm font-semibold">
            요일 비교{" "}
            <span className="font-normal text-muted-foreground">· 왜 수요일</span>
          </h3>
          <div className="overflow-hidden rounded-xl border">
            <div className="grid grid-cols-[7.5rem_1fr_auto] gap-x-4 bg-muted/50 px-4 py-2 text-[11px] font-medium text-muted-foreground">
              <span>날짜</span>
              <span>판정</span>
              <span className="text-right">참석</span>
            </div>
            {CANDIDATES.map((c) => (
              <div
                key={c.day.key}
                className={cn(
                  "grid grid-cols-[7.5rem_1fr_auto] items-center gap-x-4 border-t px-4 py-2.5 text-sm",
                  c.chosen && "bg-emerald-50 dark:bg-emerald-500/10"
                )}
              >
                <span
                  className={cn(
                    "font-semibold",
                    c.chosen && "text-emerald-700 dark:text-emerald-400"
                  )}
                >
                  {c.day.date}({c.day.label}) 14:00
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {c.verdict}
                </span>
                <span
                  className={cn(
                    "text-right font-semibold tabular-nums",
                    c.chosen
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {c.ok}/{c.total}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 시간 비교 — 수요일 안에서 왜 14:00 */}
        <section>
          <h3 className="mb-2 text-sm font-semibold">
            시간 비교{" "}
            <span className="font-normal text-muted-foreground">
              · 수요일 안에서
            </span>
          </h3>
          <div className="overflow-hidden rounded-xl border">
            {WED_TIMES.map((t) => (
              <div
                key={t.time}
                className={cn(
                  "grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 border-t px-4 py-2.5 text-sm first:border-t-0",
                  t.state === "chosen" && "bg-emerald-50 dark:bg-emerald-500/10"
                )}
              >
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    t.state === "chosen"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : t.state === "excluded"
                        ? "text-muted-foreground line-through"
                        : ""
                  )}
                >
                  {t.time}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {t.note}
                </span>
                <span
                  className={cn(
                    "text-right text-xs font-semibold",
                    t.state === "chosen"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {t.state === "chosen"
                    ? "선택"
                    : t.state === "excluded"
                      ? "제외"
                      : "가능"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 대안 상세 — 구 '일부 불참' 내용을 흡수 */}
        {showAlt && alt && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="text-sm font-semibold">
              {alt.day.full} 14:00 · {alt.ok}/{alt.total}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {alt.blocked
                .map((b) => `${b.person.name}님이 ${ro(b.reason)}`)
                .join(", ")}{" "}
              참석이 어려워요. ‘성립 실패’가 아니라, 누가 왜 빠지는지 투명하게
              보여드리고 진행할 수 있어요.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAlt((v) => !v)}
            aria-expanded={showAlt}
          >
            {showAlt ? "대안 닫기" : "대안 보기"}
          </Button>
          <Button size="sm">이 시간으로 확정</Button>
        </div>
      </div>
    </NodtimeScreen>
  )
}
