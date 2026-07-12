import { createContext, useContext } from "react"

/**
 * 화면 안의 버튼(예: '다음 · 회의 설정', '추천 받기')이 카탈로그의 현재 화면을
 * 실제로 바꿀 수 있게 하는 내비게이션 콜백. App이 setActiveId를 흘려보낸다.
 */
export const ScreenNavContext = createContext<(id: string) => void>(() => {})

export function useScreenNav() {
  return useContext(ScreenNavContext)
}
