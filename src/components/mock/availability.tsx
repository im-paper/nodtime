import { Fragment } from "react"

import { cn } from "@/lib/utils"
import {
  DAYS,
  BLOCKS,
  SCHEDULE,
  DISLIKES,
  PEOPLE,
  type DayKey,
  type Role,
} from "@/data/meeting"

/* ------------------------------------------------------------------ */
/* 참여자 가용성 개요 — 세로=사람 / 가로=날짜, 한눈에 보기                    */
/*   각 칸 = 오전(9–12) · 점심 후 오후(12–15) · 퇴근 전 오후(15–18) 3구획       */
/*   가능=비활성 회색 · 비선호=노랑 · 하드 블록=분홍+사유 · 점심(12–13)=빗금     */
/* ------------------------------------------------------------------ */

type Kind = "free" | "dislike" | "busy"

const CELL_COLOR: Record<Kind, string> = {
  free: "bg-slate-100 dark:bg-slate-800/70",
  dislike: "bg-amber-200 dark:bg-amber-400/45",
  busy: "bg-red-200 dark:bg-red-500/35",
}

function blockStates(personId: string, day: DayKey, dislikes: string[]) {
  const events = (SCHEDULE[personId] ?? []).filter((e) => e.day === day)
  return BLOCKS.map((b) => {
    const [s, e] = b.range
    const ev = events.find((x) => x.start < e && x.end > s)
    if (ev) return { kind: "busy" as Kind, reason: ev.label }
    if (dislikes.includes(b.key)) return { kind: "dislike" as Kind }
    return { kind: "free" as Kind }
  })
}

function DayCell({
  personId,
  day,
  dislikes,
}: {
  personId: string
  day: DayKey
  dislikes: string[]
}) {
  const states = blockStates(personId, day, dislikes)

  // 같은 사유로 이어지는 하드 블록 구간(연차·외근 등)을 하나의 라벨로
  const runs: { start: number; len: number; reason: string }[] = []
  for (let i = 0; i < states.length; i++) {
    const st = states[i]
    if (st.kind === "busy" && st.reason) {
      let j = i
      while (
        j + 1 < states.length &&
        states[j + 1].kind === "busy" &&
        states[j + 1].reason === st.reason
      )
        j++
      runs.push({ start: i, len: j - i + 1, reason: st.reason })
      i = j
    }
  }

  return (
    <div className="relative grid grid-cols-3 gap-0.5">
      {states.map((s, i) => {
        // 가운데(점심 후 오후, 12–15) 칸: 앞 1/3(점심 12–13)을 비활성 빗금으로
        if (i === 1 && s.kind !== "busy") {
          return (
            <div key={i} className="flex gap-px">
              <span
                title="점심 12–13 · 선택 불가"
                className="lunch-hatch h-6 flex-1 rounded-l-sm bg-slate-100 dark:bg-slate-800/70"
              />
              <span className={cn("h-6 flex-2 rounded-r-sm", CELL_COLOR[s.kind])} />
            </div>
          )
        }
        return <div key={i} className={cn("h-6 rounded-sm", CELL_COLOR[s.kind])} />
      })}
      {runs.map((r, i) => (
        <span
          key={i}
          style={{ left: `${(r.start / 3) * 100}%`, width: `${(r.len / 3) * 100}%` }}
          className="pointer-events-none absolute inset-y-0 flex items-center justify-center px-0.5 text-[9px] font-semibold text-red-700 dark:text-red-200"
        >
          <span className="truncate">{r.reason}</span>
        </span>
      ))}
    </div>
  )
}

function RoleTag({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "text-[10px] font-semibold",
        role === "필참"
          ? "text-blue-600 dark:text-blue-400"
          : "text-muted-foreground"
      )}
    >
      {role}
    </span>
  )
}

/** 각 칸이 어떤 시간대인지 보여주는 샘플 키 */
function SlotKey() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
      <span className="font-medium text-foreground/70">각 칸 시간대</span>
      <span className="flex overflow-hidden rounded-md border">
        {BLOCKS.map((b, i) => (
          <span
            key={b.key}
            className={cn("bg-muted/60 px-2 py-0.5", i > 0 && "border-l")}
          >
            {b.name}{" "}
            <span className="text-muted-foreground/70">{b.label}시</span>
          </span>
        ))}
      </span>
    </div>
  )
}

/** 전원 가용성 개요 표 */
export function AvailabilityOverview({
  roles,
}: {
  roles?: Record<string, Role>
}) {
  return (
    <div>
      <SlotKey />
      <div className="overflow-x-auto">
        <div className="grid min-w-140 grid-cols-[6.5rem_repeat(5,1fr)] items-center gap-x-3 gap-y-2.5">
          {/* 헤더 — 날짜 */}
          <div />
          {DAYS.map((d) => (
            <div
              key={d.key}
              className="text-center text-[11px] font-medium text-muted-foreground"
            >
              {d.date} {d.label}
            </div>
          ))}
          {/* 행 — 사람 */}
          {PEOPLE.map((p) => {
            const role = roles?.[p.id] ?? p.role
            const dislikes = DISLIKES[p.id] ?? []
            return (
              <Fragment key={p.id}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{p.name}</span>
                  <RoleTag role={role} />
                </div>
                {DAYS.map((d) => (
                  <DayCell
                    key={d.key}
                    personId={p.id}
                    day={d.key}
                    dislikes={dislikes}
                  />
                ))}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function GridLegend() {
  const items = [
    {
      c: "bg-slate-100 dark:bg-slate-800/70 border border-border",
      label: "가능",
    },
    { c: "bg-amber-200 dark:bg-amber-400/50", label: "비선호(점심 직후 등)" },
    { c: "bg-red-200 dark:bg-red-500/40", label: "하드 블록(사유 표기)" },
    { c: "lunch-hatch bg-slate-100 dark:bg-slate-800/70", label: "점심(선택 불가)" },
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-sm", it.c)} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
