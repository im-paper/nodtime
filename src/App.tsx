import { useState } from "react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { NodtimeLogo } from "@/components/mock/frames"
import { SCREEN_GROUPS, ScreenNavContext, type ScreenEntry } from "@/screens"

/** 화면 목록의 버튼 한 줄 — 최상위(번호) / 자식 상태(3a·3b 들여쓰기) 공용 */
function ScreenButton({
  screen,
  badge,
  active,
  onSelect,
  nested = false,
}: {
  screen: ScreenEntry
  badge: string
  active: boolean
  onSelect: (id: string) => void
  nested?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(screen.id)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
        active
          ? "bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
          : "text-foreground/75 hover:bg-muted"
      )}
    >
      <span
        className={cn(
          "tabular-nums",
          nested ? "text-[10px]" : "text-[11px]",
          active
            ? "text-blue-600 dark:text-blue-400"
            : "text-muted-foreground/60"
        )}
      >
        {badge}
      </span>
      {screen.title}
    </button>
  )
}

export function App() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const [activeId, setActiveId] = useState(SCREEN_GROUPS[0].screens[0].id)
  const active = SCREEN_GROUPS.flatMap((g) =>
    g.screens.flatMap((s) => [s, ...(s.children ?? [])])
  ).find((s) => s.id === activeId)!
  const ActiveScreen = active.component

  return (
    <div className="flex h-svh flex-col bg-muted/40">
      {/* 상단 헤더 */}
      <header className="flex shrink-0 items-center justify-between border-b bg-background px-5 py-3">
        <div className="flex items-center gap-3">
          <NodtimeLogo size="sm" />
          <div className="hidden leading-tight sm:block">
            <div className="text-[13px] font-bold">회의 일정 자동 추천</div>
            <div className="text-[11px] text-muted-foreground">
              동료 6명 · 다음 주 1시간 회의 · 화면 카탈로그
            </div>
          </div>
        </div>
        <div className="flex items-center rounded-full border bg-card p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              !isDark ? "bg-muted font-semibold" : "text-muted-foreground"
            )}
          >
            라이트
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              isDark ? "bg-muted font-semibold" : "text-muted-foreground"
            )}
          >
            다크
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden p-5">
        {/* 화면 목록 — 떠 있는 카드 */}
        <aside className="flex w-64 shrink-0 flex-col overflow-y-auto rounded-2xl border bg-card p-3 shadow-sm">
          <div className="px-2 pt-1 pb-3">
            <div className="text-sm font-bold">화면 목록</div>
            <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              왼쪽에서 화면을 골라 오른쪽에서 확인하세요.
            </div>
          </div>
          <nav className="flex flex-col gap-4">
            {SCREEN_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-2 pb-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground">
                  {group.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.screens.map((s) => (
                    <div key={s.id} className="flex flex-col gap-0.5">
                      <ScreenButton
                        screen={s}
                        badge={String(s.no).padStart(2, "0")}
                        active={s.id === activeId}
                        onSelect={setActiveId}
                      />
                      {s.children && (
                        <div className="ml-3.5 flex flex-col gap-0.5 border-l pl-2">
                          {s.children.map((child, i) => (
                            <ScreenButton
                              key={child.id}
                              screen={child}
                              badge={`${s.no}${String.fromCharCode(97 + i)}`}
                              active={child.id === activeId}
                              onSelect={setActiveId}
                              nested
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* 우측 — 선택된 화면 미리보기 */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl pb-10">
            <p className="mb-4 px-1 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                {String(active.no).padStart(2, "0")} · {active.title}
              </span>
              {" — "}
              {active.desc}
            </p>
            <ScreenNavContext.Provider value={setActiveId}>
              <ActiveScreen />
            </ScreenNavContext.Provider>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
