import type { ComponentType } from "react"

import {
  Screen01Dashboard,
  Screen02Invite,
  Screen03SetupBase,
  Screen03Setup,
  Screen03bSetupFail,
  Screen04Loading,
  Screen05Result,
} from "@/screens/organizer"
import {
  Screen07Invited,
  Screen08Members,
  Screen10Result,
} from "@/screens/participant"
import {
  Screen09Settings,
  Screen11Dislike,
  Screen12Calendar,
} from "@/screens/misc"

export type ScreenEntry = {
  id: string
  no: number
  title: string
  desc: string
  component: ComponentType
  /** 이 화면의 상태 분기 (예: 후보 있음 / 성립 실패) — 목록에서 들여써 표기 */
  children?: ScreenEntry[]
}

export type ScreenGroup = {
  label: string
  screens: ScreenEntry[]
}

export const SCREEN_GROUPS: ScreenGroup[] = [
  {
    label: "주최자 플로우",
    screens: [
      {
        id: "dashboard",
        no: 1,
        title: "회의 목록 (대시보드)",
        desc: "내가 주최했거나 참여 중인 회의와 상태(조율 중/확정). 새 회의 만들기 진입점.",
        component: Screen01Dashboard,
      },
      {
        id: "invite",
        no: 2,
        title: "참여자 초대",
        desc: "동료를 필참/선참으로 지정하고, 아래 전원 가용성 개요에서 누가 언제 가능한지 한눈에 확인해요.",
        component: Screen02Invite,
      },
      {
        id: "setup",
        no: 3,
        title: "회의 설정",
        desc: "이름·기간·시간·인원을 정하는 진입 화면. 오른쪽 실시간 미리보기가 아직 비어 있는 기본 상태예요. 조건에 따라 아래 '후보 있음' / '성립 실패'로 갈라져요.",
        component: Screen03SetupBase,
        children: [
          {
            id: "setup-ok",
            no: 3,
            title: "후보 있음",
            desc: "조건을 넣으니 미리보기에 예상 후보 수와 필참 전원 가능한 날이 잡힌 상태.",
            component: Screen03Setup,
          },
          {
            id: "setup-fail",
            no: 3,
            title: "성립 실패",
            desc: "미리보기 후보가 0개일 때의 분기. 필참 최소 인원을 못 채운 병목 원인(누가·왜)을 보여주고, 실제로 성립되는 해결 옵션을 골라 조건을 바꾸도록 안내해요.",
            component: Screen03bSetupFail,
          },
        ],
      },
      {
        id: "loading",
        no: 4,
        title: "최적 시간 찾는 중",
        desc: "추천 근거가 되는 비교 과정을 그대로 노출. 필참 전원 가능한 날이 있어 1단계에서 결정돼요.",
        component: Screen04Loading,
      },
      {
        id: "result",
        no: 5,
        title: "추천 결과",
        desc: "추천 일정 + 추천 이유 + 상황 안내(필참 불편/선참 겹침) + 요일 후보 비교. '대안 보기'로 일부 불참 케이스까지.",
        component: Screen05Result,
      },
    ],
  },
  {
    label: "참여자 플로우",
    screens: [
      {
        id: "invited",
        no: 6,
        title: "초대 알림",
        desc: "회의에 초대됐다는 안내와 내 역할(필참/선참) 확인. 비선호 시간은 다시 묻지 않음.",
        component: Screen07Invited,
      },
      {
        id: "members",
        no: 7,
        title: "참석자 목록 보기",
        desc: "주최자의 '참여자 초대' 화면과 같은 구성 — 역할별 명단과 전원 가용성 개요를 한 화면에서 읽기 전용으로 확인해요.",
        component: Screen08Members,
      },
      {
        id: "result-view",
        no: 8,
        title: "회의 결과 보기",
        desc: "확정(또는 추천)된 시간과 내 참석 상태 확인.",
        component: Screen10Result,
      },
    ],
  },
  {
    label: "그 외 화면",
    screens: [
      {
        id: "settings",
        no: 9,
        title: "설정",
        desc: "좌측 내비의 '설정'을 누르면 오는 허브. 비선호 시간·캘린더 연동 두 항목을 카드로 모아 보여줘요.",
        component: Screen09Settings,
        children: [
          {
            id: "dislike",
            no: 9,
            title: "비선호 시간 설정",
            desc: "마이페이지에서 '점심 직후 피하기' 같은 개인 비선호 시간을 미리 등록. 최대 3개.",
            component: Screen11Dislike,
          },
          {
            id: "calendar",
            no: 9,
            title: "캘린더 연동 설정",
            desc: "Google/Outlook 캘린더 연동 상태 관리.",
            component: Screen12Calendar,
          },
        ],
      },
    ],
  },
]
