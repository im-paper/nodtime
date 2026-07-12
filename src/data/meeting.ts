// 회의 일정 자동 추천 서비스 — 모든 화면에서 공통으로 사용하는 예시 데이터

export type Role = "필참" | "선참"

export type Person = {
  id: string
  name: string
  role: Role
  note?: string
  /** 아바타 배경용 tailwind 클래스 */
  color: string
  calendarConnected: boolean
}

export const PEOPLE: Person[] = [
  {
    id: "wade",
    name: "지훈",
    role: "필참",
    note: "주최자 겸 필참",
    color: "bg-blue-500",
    calendarConnected: true,
  },
  {
    id: "a",
    name: "서연",
    role: "필참",
    note: "목요일 연차",
    color: "bg-emerald-500",
    calendarConnected: true,
  },
  {
    id: "b",
    name: "민준",
    role: "필참",
    note: "월·화 외근 · 점심 직후 비선호",
    color: "bg-amber-500",
    calendarConnected: true,
  },
  {
    id: "c",
    name: "도윤",
    role: "필참",
    note: "금요일 고객 미팅",
    color: "bg-rose-500",
    calendarConnected: true,
  },
  {
    id: "d",
    name: "하린",
    role: "필참",
    note: "월요일 외근",
    color: "bg-indigo-500",
    calendarConnected: true,
  },
  {
    id: "e",
    name: "유나",
    role: "선참",
    note: "수요일 오후 다른 회의",
    color: "bg-teal-500",
    calendarConnected: true,
  },
]

export const REQUIRED = PEOPLE.filter((p) => p.role === "필참")
export const OPTIONAL = PEOPLE.filter((p) => p.role === "선참")

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri"

export type Day = {
  key: DayKey
  /** 요일 한 글자 */
  label: string
  /** 예: 7/13 */
  date: string
  /** 예: 7월 13일 (월) */
  full: string
}

export const DAYS: Day[] = [
  { key: "mon", label: "월", date: "7/13", full: "7월 13일 (월)" },
  { key: "tue", label: "화", date: "7/14", full: "7월 14일 (화)" },
  { key: "wed", label: "수", date: "7/15", full: "7월 15일 (수)" },
  { key: "thu", label: "목", date: "7/16", full: "7월 16일 (목)" },
  { key: "fri", label: "금", date: "7/17", full: "7월 17일 (금)" },
]

/** ok=참석 가능 / dislike=불편(비선호, 소프트) / blocked=참석 어려움(하드 블록) / pending=직접 입력 대기 */
export type CellStatus = "ok" | "dislike" | "blocked" | "pending"

export type Cell = {
  status: CellStatus
  /** 불가 사유 (Constraint — 이진 판단) */
  reason?: string
}

/**
 * 요일 단위 가용성 그리드.
 * Constraint(외근·연차·근무 외 시간·다른 필참 회의 겹침)는 무조건 불가로 처리 — 점수 없음.
 */
export const AVAILABILITY: Record<string, Record<DayKey, Cell>> = {
  wade: {
    mon: { status: "ok" },
    tue: { status: "ok" },
    wed: { status: "ok" },
    thu: { status: "ok" },
    fri: { status: "ok" },
  },
  a: {
    mon: { status: "ok" },
    tue: { status: "ok" },
    wed: { status: "ok" },
    thu: { status: "blocked", reason: "연차" },
    fri: { status: "ok" },
  },
  b: {
    mon: { status: "blocked", reason: "외근" },
    tue: { status: "blocked", reason: "외근" },
    wed: { status: "dislike" },
    thu: { status: "ok" },
    fri: { status: "ok" },
  },
  c: {
    mon: { status: "ok" },
    tue: { status: "ok" },
    wed: { status: "ok" },
    thu: { status: "ok" },
    fri: { status: "blocked", reason: "고객 미팅" },
  },
  d: {
    // 캘린더 미연동 → 직접 입력으로 반영된 가용성
    mon: { status: "blocked", reason: "외근" },
    tue: { status: "ok" },
    wed: { status: "ok" },
    thu: { status: "ok" },
    fri: { status: "ok" },
  },
  e: {
    mon: { status: "ok" },
    tue: { status: "ok" },
    wed: { status: "dislike" },
    thu: { status: "ok" },
    fri: { status: "ok" },
  },
}

/** D가 직접 입력을 아직 하지 않은 상태의 그리드 (가용성 프리뷰 화면에서 대기 상태 예시용) */
export const AVAILABILITY_D_PENDING: Record<DayKey, Cell> = {
  mon: { status: "pending" },
  tue: { status: "pending" },
  wed: { status: "pending" },
  thu: { status: "pending" },
  fri: { status: "pending" },
}

/** 요일별 참석 가능한 필참 인원 수 요약 */
export function requiredCountByDay(day: DayKey): {
  ok: number
  total: number
  blocked: { person: Person; reason: string }[]
} {
  const blocked: { person: Person; reason: string }[] = []
  let ok = 0
  for (const p of REQUIRED) {
    const cell = AVAILABILITY[p.id][day]
    // 불편(dislike)은 소프트 비선호라 참석 가능으로 집계 — 하드 블록만 불가
    if (cell.status === "blocked") {
      blocked.push({ person: p, reason: cell.reason ?? "불가" })
    } else {
      ok += 1
    }
  }
  return { ok, total: REQUIRED.length, blocked }
}

export const MEETING = {
  title: "7월 제품 로드맵 리뷰",
  duration: "1시간",
  periodLabel: "7월 13일 (월) ~ 7월 17일 (금)",
  organizer: "지훈",
  inviteUrl: "nodtime.app/i/roadmap-0715",
}

/** 표준 결과 — 수요일 14:00 추천 근거 (3단계 순차 비교) */
export const WED_RESULT = {
  day: DAYS[2],
  time: "14:00 ~ 15:00",
  steps: [
    {
      step: 1,
      title: "필참 인원 참석 가능 여부",
      detail:
        "수요일은 필참 5명(지훈·서연·민준·도윤·하린) 전원이 가능한 유일한 요일이에요. 수요일 안에서 13:00, 14:00, 15:00, 16:00 네 후보가 남았어요.",
      result: "후보 4개, 동률 → 다음 단계로",
      decided: false,
    },
    {
      step: 2,
      title: "필참자 비선호 시간 회피",
      detail:
        "지훈님이 마이페이지에 설정해둔 \"점심 직후(13:00~14:00)는 불편해요\"와 겹치는 13:00 후보를 뒤로 미뤘어요.",
      result: "13:00 제외 → 후보 3개, 동률 → 다음 단계로",
      decided: false,
    },
    {
      step: 3,
      title: "선참자 참석 가능 여부",
      detail:
        "선참 유나님이 16:00에 다른 회의가 있어서 14:00과 15:00을 우선했어요. 선참자 일정 때문에 필참자 시간이 밀리지는 않아요.",
      result: "16:00 제외 → 14:00 · 15:00 동률",
      decided: false,
    },
    {
      step: 4,
      title: "동률이면 가장 이른 시간",
      detail: "남은 두 후보 중 더 이른 14:00으로 확정했어요.",
      result: "수요일 14:00 확정",
      decided: true,
    },
  ],
  candidates: [
    {
      rank: 1,
      label: "7월 15일 (수) 14:00 ~ 15:00",
      required: "필참 5/5",
      optional: "선참 유나 가능",
      note: "비선호 시간 회피",
      chosen: true,
    },
    {
      rank: 2,
      label: "7월 15일 (수) 15:00 ~ 16:00",
      required: "필참 5/5",
      optional: "선참 유나 가능",
      note: "14:00보다 늦은 시간",
      chosen: false,
    },
    {
      rank: 3,
      label: "7월 15일 (수) 16:00 ~ 17:00",
      required: "필참 5/5",
      optional: "선참 유나 불가 (다른 회의)",
      note: "3단계에서 밀림",
      chosen: false,
    },
    {
      rank: 4,
      label: "7월 15일 (수) 13:00 ~ 14:00",
      required: "필참 5/5",
      optional: "선참 유나 가능",
      note: "지훈님 비선호 시간과 겹침",
      chosen: false,
    },
  ],
}

/** 일부 불참 예시 — 목요일 지정 시 A가 연차라 4/5 */
export const THU_RESULT = {
  day: DAYS[3],
  time: "14:00 ~ 15:00",
  absent: { person: PEOPLE[1], reason: "연차" },
  attendRatio: "4/5",
  alternative: {
    label: "7월 15일 (수) 14:00 ~ 15:00",
    required: "필참 5/5",
    note: "하루 앞당기면 전원 참석할 수 있어요",
  },
}

/** 대시보드 회의 목록 */
export type MeetingListItem = {
  id: string
  title: string
  status: "조율 중" | "확정"
  mine: boolean
  time?: string
  people: string
  period?: string
}

export const MEETING_LIST: MeetingListItem[] = [
  {
    id: "m1",
    title: "7월 제품 로드맵 리뷰",
    status: "조율 중",
    mine: true,
    people: "필참 5 · 선참 1",
    period: "7/13 (월) ~ 7/17 (금) 중 1시간",
  },
  {
    id: "m2",
    title: "Q3 킥오프",
    status: "확정",
    mine: true,
    time: "7월 14일 (화) 10:00 ~ 11:00",
    people: "필참 4 · 선참 2",
  },
  {
    id: "m3",
    title: "디자인 시스템 싱크",
    status: "확정",
    mine: false,
    time: "7월 17일 (금) 11:00 ~ 12:00",
    people: "필참 3 · 선참 3",
  },
]

/* ------------------------------------------------------------------ */
/* Nodtime 새 회의 플로우 전용 — 시간 구획 · 캘린더 · 후보/결과 데이터        */
/* ------------------------------------------------------------------ */

/** 업무시간 9~18시 · 3구획(오전 / 점심 후 오후 / 퇴근 전 오후) */
export const DAY_START = 9
export const DAY_END = 18
/** 점심 12~13시 — 가운데 블록(12~15) 안에 있고, 선택 불가(비활성)로 표기 */
export const LUNCH: [number, number] = [12, 13]

export type BlockKey = "am" | "aft1" | "aft2"
export const BLOCKS: {
  key: BlockKey
  name: string
  label: string
  range: [number, number]
}[] = [
  { key: "am", name: "오전", label: "9–12", range: [9, 12] },
  { key: "aft1", name: "점심 후 오후", label: "12–15", range: [12, 15] },
  { key: "aft2", name: "퇴근 전 오후", label: "15–18", range: [15, 18] },
]

/** 마이페이지 — 비선호 시간 (요일 × 시간대 조합, 최대 3개). 점심(12–13시)은 원래 선택 대상이 아니라 오후1 구획은 13–15시로 표시 */
export type DislikeSlot = { day: DayKey; block: BlockKey }

export const DISLIKE_SLOTS: DislikeSlot[] = [{ day: "wed", block: "aft1" }]

export const DISLIKE_MAX = 3

/** 연동된 캘린더에서 가져온 일정(바쁨) — 바에서 빨간 밴드로 표기 */
export type Busy = { day: DayKey; start: number; end: number; label: string }
export const SCHEDULE: Record<string, Busy[]> = {
  wade: [],
  a: [{ day: "thu", start: 9, end: 18, label: "연차" }],
  b: [
    { day: "mon", start: 9, end: 18, label: "외근" },
    { day: "tue", start: 9, end: 18, label: "외근" },
  ],
  c: [{ day: "fri", start: 13, end: 17, label: "고객 미팅" }],
  d: [{ day: "mon", start: 9, end: 18, label: "외근" }],
  e: [{ day: "wed", start: 14, end: 18, label: "다른 회의" }],
}

/**
 * 비선호(소프트) — 사람별 요일 무관 반복 구획. 바에서 노랑으로 표기.
 * 추천 반영은 필참만, 선참(유나)의 비선호는 표시만 하고 점수엔 넣지 않는다.
 */
export const DISLIKES: Record<string, BlockKey[]> = {
  wade: [],
  a: [],
  b: ["aft1"], // 점심 직후(오후1)가 불편
  c: [],
  d: [],
  e: [],
}

/** 특정 시각에 겹치는 일정 */
export function busyAt(
  personId: string,
  day: DayKey,
  hour: number
): Busy | undefined {
  return SCHEDULE[personId]?.find(
    (b) => b.day === day && hour >= b.start && hour < b.end
  )
}

/** 특정 시각에 참석 가능한 필참 인원 (바쁨=불가, 비선호는 소프트라 참석으로 집계) */
export function attendanceAt(
  day: DayKey,
  hour: number
): { ok: number; total: number; blocked: { person: Person; reason: string }[] } {
  const blocked: { person: Person; reason: string }[] = []
  for (const p of REQUIRED) {
    const b = busyAt(p.id, day, hour)
    if (b) blocked.push({ person: p, reason: b.label })
  }
  return { ok: REQUIRED.length - blocked.length, total: REQUIRED.length, blocked }
}

/** 조사 로/으로 선택 (받침 없음·ㄹ받침이면 "로") */
export function ro(word: string): string {
  const code = word.charCodeAt(word.length - 1)
  if (code < 0xac00 || code > 0xd7a3) return word + "로"
  const jong = (code - 0xac00) % 28
  return word + (jong === 0 || jong === 8 ? "로" : "으로")
}

/** 추천 기준 시각 (요일 후보를 같은 시각에서 비교) */
export const REC_HOUR = 14
export const REC_TIME = "14:00 ~ 15:00"

export type Candidate = {
  day: Day
  ok: number
  total: number
  blocked: { person: Person; reason: string }[]
  chosen: boolean
  /** 판정 문구 */
  verdict: string
}

/** 요일별 후보 (참석 인원 내림차순, 수요일 5/5 최종 선택) */
export const CANDIDATES: Candidate[] = DAYS.map((d) => {
  const { ok, total, blocked } = attendanceAt(d.key, REC_HOUR)
  const chosen = ok === total
  const verdict = chosen
    ? "필참 전원 참석 · 최종 선택"
    : blocked.map((b) => `${b.person.name} ${ro(b.reason)} 불참`).join(" · ")
  return { day: d, ok, total, blocked, chosen, verdict }
})
  .slice()
  .sort((a, b) => b.ok - a.ok || DAYS.indexOf(a.day) - DAYS.indexOf(b.day))

/** 3/N 회의 설정 화면의 실시간 미리보기(성립 가능성) 요약 */
export const PREVIEW = {
  /** 필참 4명 이상 가능한 (요일×시간) 후보 수 */
  candidateCount: 12,
  /** 필참 전원 가능한 날 수 */
  allRequiredDays: CANDIDATES.filter((c) => c.ok === c.total).length,
}

/** 선택된 요일(수요일) 안에서의 시간 후보 — 결과의 '시간 비교' 근거 */
export type TimeState = "excluded" | "chosen" | "ok"
export const WED_TIMES: { time: string; state: TimeState; note: string }[] = [
  { time: "13:00", state: "excluded", note: "점심 직후라 비선호 — 회피" },
  { time: "14:00", state: "chosen", note: "가장 이른 적정 시간 · 최종 선택" },
  { time: "15:00", state: "ok", note: "14:00과 동률이지만 더 늦음" },
  { time: "16:00", state: "ok", note: "가장 늦은 후보" },
]

/** 로딩 화면 — 많은 후보 → 좁혀가는 과정 (필참 우선 4기준) */
export const LOADING = {
  prefilters: [
    { title: "근무시간 외·점심시간 제외", note: "9–18시 · 점심 제외" },
    { title: "필참 다수 불가한 시간 제외", note: "필참 4명 미만 제외" },
  ],
  criteria: [
    { no: 1, title: "참석 인원 비교", result: "수요일 5/5 · 시간 후보 4개", fired: true },
    { no: 2, title: "필참 비선호 회피", result: "13:00 제외 → 3개", fired: true },
    { no: 3, title: "선참 참석 가능", result: "유나 오후 겹침 · 필참 기준 유지", fired: true },
    { no: 4, title: "동률이면 이른 시간", result: "14:00 선택 → 확정", fired: true },
  ],
  summary: "수요일 필참 전원 가능 → 비선호·선참·시간까지 따져 14:00으로 좁혔어요.",
}

/** 결과 화면 — 추천 일정 + 상황 안내 (전체 6명 = 필참 5 + 선참 1) */
export const RESULT = {
  day: DAYS[2],
  time: REC_TIME,
  /** 참석 요약 */
  attend: {
    total: PEOPLE.length, // 6
    required: `${REQUIRED.length}/${REQUIRED.length}`, // 5/5
    attending: REQUIRED.length, // 5 (선참 유나는 겹쳐서 불참)
  },
  reasons: [
    "필참 5명(지훈·서연·민준·도윤·하린)이 모두 가능한 유일한 날이에요",
    "13:00은 점심 직후라 피하고, 가장 이른 적정 시간으로 14:00을 골랐어요",
  ],
  /** 앰버 — 필참의 소프트 비선호 (참석은 가능) */
  softNote: "민준은 점심 직후라 조금 불편하지만, 참석은 할 수 있어요.",
  /** 블루 — 선참 겹침 (필참 우선이라 그대로 추천) */
  optionalNote:
    "선참 유나는 수요일 오후 다른 일정과 겹쳐요. 그래도 필참을 우선하는 기준이라, 필참에 맞춰 그대로 추천했어요.",
}

/* ------------------------------------------------------------------ */
/* 회의 성립 실패 (설정 미리보기 분기) — 필참 최소 인원 미충족 시나리오        */
/* ------------------------------------------------------------------ */

/** 필참 최소 인원(정족수) — 이 수 미만이면 회의가 성립하지 않는다 */
export const MIN_REQUIRED = 4

/** 병목이 된 필참 한 명과 그 사유 */
export type FailBottleneck = {
  person: Person
  /** 왜 막히는지 — 기간 표현을 포함한다 (예: "요청 기간 전체 외근") */
  cause: string
}

/** 해결 옵션 — 실제로 회의가 성립되는(=후보가 생기는) 선택지만 담는다 */
export type FailOption = {
  label: string
  /** 이 옵션을 고르면 어떻게 풀리는지 (죽은 버튼 방지용 예상 결과) */
  expect: string
  /** 조건을 바꾸는 지렛대: 역할 전환 / 기간 확장 / 최소 인원 하향 */
  kind: "role" | "period" | "quorum"
}

/** 요일별 참석 가능한 필참 수 — 미리보기 요일 스트립용 */
export type FailDay = { day: Day; ok: number }

/**
 * "이 조건으로는 회의가 성립되지 않아요" 상태의 예시 데이터.
 * 하린(전 기간 외근)·민준(전 기간 연차)이 매일 빠지고, 다른 일정까지 겹쳐
 * 참석 가능한 필참이 날마다 1~3명 → 어느 날도 최소 4명을 채우지 못한다.
 * perDay가 이 요일별 편차를 스트립으로 그대로 보여주고,
 * 해결 옵션은 각 지렛대가 실제로 성립을 만들어내는 경우만 제시한다.
 */
export const SETUP_FAIL = {
  /** 현재 조건에서 최소 인원을 채우는 후보 수 (0이면 성립 실패) */
  candidateCount: 0,
  minRequired: MIN_REQUIRED,
  requiredTotal: REQUIRED.length,
  /** 최소 인원 라벨 — 예: "4/5" */
  quorumLabel: `${MIN_REQUIRED}/${REQUIRED.length}`,
  summary: "요청 기간 안에서 필참 최소 인원을 채우는 시간이 없어요.",
  /** 요일별 참석 가능 필참 — 날마다 1~3명으로 편차, 모두 기준선(4) 아래 */
  perDay: DAYS.map((d, i) => ({ day: d, ok: [2, 3, 1, 3, 2][i] })) as FailDay[],
  bottlenecks: [
    { person: PEOPLE.find((p) => p.id === "d")!, cause: "요청 기간 전체 외근" },
    { person: PEOPLE.find((p) => p.id === "b")!, cause: "요청 기간 전체 연차" },
  ] as FailBottleneck[],
  options: [
    {
      label: "필참 최소 인원을 3명으로 낮춰서 다시 추천받기",
      expect: "인원이 가장 많은 날(3명) 기준으로 낮추면 후보가 생겨요",
      kind: "quorum",
    },
    {
      label: "요청 기간을 다음 주까지 넓혀서 다시 찾기",
      expect: "다음 주엔 하린 외근·민준 연차가 모두 끝나 필참 전원 가능한 날이 생겨요",
      kind: "period",
    },
  ] as FailOption[],
}
