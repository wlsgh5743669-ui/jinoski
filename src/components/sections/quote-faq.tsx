import { Container } from "@/components/shared/container";
import { QA_EN, QA_ZH } from "@/lib/quote-faq-i18n";

// 연박·가족 여러 팀 손님이 자주 묻는 질문 (/ko/quote 아래)
const QA: { q: string; a: string }[] = [
  {
    q: "2박 3일이면 수업을 며칠 동안 받나요?",
    a: "3일 모두 받을 수 있어요. 도착하는 날·떠나는 날은 이동 시간 때문에 1회만 하시는 분이 많아요. 견적 계산기 3단계에서 날짜마다 안 함 / 1번 / 2번과 수업 시간을 따로 고를 수 있어요. 도착일은 오후 교시, 출발일은 오전 교시를 추천드려요.",
  },
  {
    q: "하루 2회 수업이면 쉬는 시간이 있나요?",
    a: "있어요. 2시간 수업이면 1+3교시(09:00~11:00 · 13:20~15:20) 또는 2+4교시(11:00~13:00 · 15:30~17:30)를, 3·4시간 수업이면 오전+오후를 추천드려요. 중간에 점심을 드시고 쉬어서 아이들도 무리가 없어요. 야간(2시간은 5교시 19:00~21:00)과 묶을 수도 있어요. 저녁 정설 17:30~19:00 이후 야간이 시작돼요.",
  },
  {
    q: "매일 같은 강사에게 배울 수 있나요?",
    a: "연박 손님은 최대한 같은 강사로 배정해요. 아이의 실력과 성향을 이미 알고 있어서 다음 날 수업이 바로 이어져요. 강사 일정상 바뀌는 날이 있으면 확정 안내 때 미리 알려드려요.",
  },
  {
    q: "가족 두 팀이 같이 가는데, 따로 수업하나요?",
    a: "팀(가족)마다 강사가 따로 배정돼요. 같은 시간에 나란히 수업하니 가족끼리 함께 움직이기 좋아요. 아이들 실력이 비슷하면 두 가족 아이들을 한 반으로 묶을 수도 있어요 (강사 1명당 최대 3명).",
  },
  {
    q: "한 가족이 4명 이상이면 어떻게 하나요?",
    a: "강사 1명당 최대 3명까지라서 4명 이상은 반을 나눠요. 예) 4명 → 2명+2명, 5명 → 3명+2명. 실력·나이가 다르면 비슷한 아이끼리 묶어 드려요. 견적 계산기 「반은 어떻게 나눌까요?」에서 알뜰하게(3명씩)·소수정예(2명씩)·1:1 전담 중 고르면 바로 계산돼요.",
  },
  {
    q: "리프트권·장비 40% 할인은 어떻게 받나요?",
    a: "견적 계산기 「리프트·장비도 필요하세요?」에서 사람마다 리프트만 / 리프트+장비 / 필요없음을 고르면 비발디파크 매표소 정가에서 40% 할인된 금액으로 계산돼요. 강습 확정 때 함께 안내드리고, 현장에서 바로 받으실 수 있게 준비해 드려요.",
  },
  {
    q: "리프트는 몇 시간권을 사야 하나요?",
    a: "하루 1회 2시간 수업이면 3시간권, 3시간 수업이면 5시간권, 하루 2회 수업이면 7시간권을 추천해요. 수업 후 가족끼리 더 타고 싶으시면 한 단계 긴 시간권을 고르세요. 리프트권은 하루에 1장씩이에요.",
  },
  {
    q: "어린이(소인) 요금은 몇 살까지인가요?",
    a: "비발디파크 기준 소인은 13세 이하(초등학생, 한국 나이)예요. 3월에 중학교에 들어가는 아이도 소인이고, 14세 이상은 대인이에요. 견적 계산기에서 어른·어린이 인원을 나눠 넣으면 대인·소인 요금이 따로 계산돼요. 매표소에서 나이를 확인할 수 있어요.",
  },
  {
    q: "주말이랑 평일 가격이 다른가요?",
    a: "강습료는 같고, 리프트·장비 요금만 주중과 주말·공휴일이 달라요. 견적 계산기에 첫날 날짜를 넣으면 날짜별로 평일·주말 요금이 자동 적용돼요. 공휴일은 주말 요금이에요.",
  },
  {
    q: "헬멧과 스키복도 할인되나요?",
    a: "헬멧은 할인 대상이 아니에요. 기본 헬멧 5,000원, 바이저 헬멧 15,000원(하루)이고 견적 계산기에서 사람마다 고를 수 있어요. 의류는 제휴 렌탈샵 안내 드립니다.^^ 아이들은 안전을 위해 헬멧 착용을 꼭 권해요.",
  },
  {
    q: "강습 허가권(패찰)은 따로 사야 하나요?",
    a: "아니요. 견적 금액에 강습 허가권(패찰)이 이미 포함돼 있어요. 지노스키가 준비해 드려서 손님은 신경 쓰지 않으셔도 돼요.",
  },
  {
    q: "아이가 처음인데 연박으로 배워도 괜찮을까요?",
    a: "오히려 연박이 가장 빨리 늘어요. 첫날 장비와 슬로프에 익숙해지고, 둘째 날부터 턴을 배우고, 마지막 날엔 가족과 함께 내려오는 아이가 많아요. 스키·스노보드 모두 만 4세부터 가능해요.",
  },
  {
    q: "부모님은 수업 동안 뭘 하나요?",
    a: "슬로프 밖에서 구경하셔도 되고, 스키·보드를 타실 수 있으면 리프트권·장비를 구매해 같은 슬로프에서 함께 타셔도 돼요. 부모님도 배우시려면 견적 계산기 인원에 어른으로 넣어 주세요.",
  },
  {
    q: "사진·영상도 매일 찍어 주나요?",
    a: "네, 매 수업 사진·영상 촬영이 무료로 포함돼요. 연박이면 첫날과 마지막 날 영상을 비교해서 얼마나 늘었는지 보실 수 있어요.",
  },
  {
    q: "결제는 언제, 어떻게 하나요?",
    a: "견적 문의를 보내주시면 강사 일정을 확인해서 연락드려요. 확정 안내를 받으시면 예약금(총 금액의 20%)을 입금해 주세요 — 입금이 확인되면 예약이 확정되고, 잔금은 강습 당일에 결제해요. 리프트권·장비(40% 할인)도 강습료와 함께 지노스키에 결제하시면 현장에서는 받기만 하면 돼요. 계좌이체(국민은행 010-4047-7711 · 박진호(지노컴퍼니)) 또는 스마트스토어(네이버페이·카드)로 결제할 수 있어요. 얼리버드 기간(11월 10일까지 예약)에는 2·3시간 레슨과 원데이·나이트 풀케어 레슨료 10% 할인이 적용돼요.",
  },
  {
    q: "중간에 일정이 바뀌거나 날씨가 안 좋으면요?",
    a: "레슨 2일 전까지 1회 무료로 일정을 바꿀 수 있어요 (강사 일정이 비는 날짜, 시즌 내). 환불은 레슨 3일 전까지 100%, 1~2일 전 50%, 당일 취소·노쇼는 환불이 안 돼요. 기상 악화로 슬로프 운영이 중단되면 무료 일정 변경 또는 전액 환불해 드려요.",
  },
];

const HEAD = {
  ko: ["연박·가족 여행 자주 묻는 질문", "2박 3일, 하루 2회, 여러 가족이 함께 오실 때 많이 물어보세요."],
  en: ["Multi-day & family trip FAQ", "Common questions about 3-day trips, two lessons a day, and several families together."],
  zh: ["连住·家庭旅行常见问题", "三天两夜、一天两次课、多个家庭一起来时常问的问题。"],
} as const;

export function QuoteFaq({ locale = "ko" }: { locale?: "ko" | "en" | "zh" }) {
  const list = locale === "en" ? QA_EN : locale === "zh" ? QA_ZH : QA;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-500">Q&amp;A</p>
          <h2 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900 sm:text-[32px]">{HEAD[locale][0]}</h2>
          <p className="mt-2 text-[14.5px] text-snow-600">{HEAD[locale][1]}</p>
          <div className="mt-7 flex flex-col gap-2.5">
            {list.map((x, i) => (
              <details
                key={x.q}
                className="group rounded-2xl bg-ice-200/70 px-5 py-4 ring-1 ring-snow-300/50 open:bg-white open:ring-brand-500/30"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[15.5px] font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="mr-1.5 text-brand-500">Q.</span>
                    {x.q}
                  </span>
                  <span className="mt-0.5 shrink-0 text-[18px] leading-none text-snow-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-snow-700">{x.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
