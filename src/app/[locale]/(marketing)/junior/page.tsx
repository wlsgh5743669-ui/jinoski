import type { Metadata } from "next";
import { Award, CalendarCheck, ClipboardCheck, Medal, ShieldCheck, Video } from "lucide-react";
import { isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import { JUNIOR_GRADES, JUNIOR_PRICES, type JuniorProgram } from "@/config/junior-grade";
import { approxUsd } from "@/lib/usd";

type L = "ko" | "en" | "zh";

const T = {
  ko: {
    eyebrow: "Junior Ski Badge",
    title: ["주니어 스키", "기술등급 심사"],
    desc: "대한스키지도자연맹(KSIA) 공식 주니어 스키 기술등급. 우리 아이 실력을 공식 뱃지와 인증서로 남겨보세요.",
    facts: [
      ["만 7~17세", "스키 · 공식 10단계"],
      ["2시간", "수준 확인 + 심사"],
      ["공식 뱃지", "합격하면 등급 뱃지·인증서"],
      ["7등급 특전", "만 18세에 지도자 Level 1 자동 취득"],
    ],
    gradesTitle: "10단계 등급표",
    gradesSub: "등급마다 뱃지 색이 달라요. 한 번에 한 단계씩 도전해요.",
    slope: { easy: "초급~초중급 슬로프", mid: "중상급 슬로프", hard: "상급 슬로프" },
    priceTitle: "심사 요금",
    priceSub: "2시간 동안 실력을 확인하고 바로 심사해요 · 연맹 응시료·발급료 포함",
    tierA: "1~6등급 심사",
    tierB: "7~10등급 심사",
    tierBNote: "Level 3 심사위원이 심사해요",
    ppl: { "1:1": "1명", "1:2": "2명 (강사 1 : 2)", "1:3": "3명 (강사 1 : 3)" },
    total: "반 전체 금액",
    plus: "+ 패찰 1인 25,000원 별도 · 리프트권·장비는 정가 40% 할인",
    book: "이 심사로 예약하기",
    stepsTitle: "이렇게 진행돼요",
    steps: [
      ["상담", "지금 실력과 도전할 등급을 알려주세요. 애매하면 낮은 등급부터 추천드려요."],
      ["워밍업 · 연습", "심사 종목을 함께 연습하고 자세를 다듬어요."],
      ["심사", "공인 지도자가 슬로프에서 심사해요."],
      ["결과 등록", "연맹에 결과를 등록하면 공식 급증이 나오고, 뱃지·인증서를 전달해 드려요."],
    ],
    incTitle: "포함 사항",
    inc: ["2시간 1:1~1:3 수업 + 심사", "대한스키지도자연맹 응시료 + 뱃지·인증서 발급료", "심사 장면 사진·영상", "합격 시 등급 뱃지 · 인증서"],
    noteTitle: "꼭 확인해 주세요",
    notes: [
      "등급 합격을 보장하지는 않아요. 아쉽게 떨어지면 연습 후 다시 도전할 수 있어요.",
      "한 번에 한 등급씩 심사해요.",
      "스키 종목만 해당돼요. 스노보드 등급은 따로 문의해 주세요.",
      "날씨·슬로프 상황에 따라 심사 일정이 바뀔 수 있어요.",
      "실력이 아직 부족하면 일반 레슨이나 시즌 8회 패키지로 먼저 연습하는 걸 추천드려요.",
    ],
    faqTitle: "자주 묻는 질문",
    faq: [
      ["몇 살부터 볼 수 있나요?", "만 7세부터 만 17세까지예요."],
      ["처음 타는 아이도 되나요?", "1등급(스노우플라우)은 A자로 멈출 수 있으면 도전할 수 있어요. 처음이라면 레슨으로 먼저 익히고 오세요."],
      ["7등급을 따면 뭐가 좋아요?", "주니어 7등급을 따면 만 18세가 되었을 때 대한스키지도자연맹 스키 Level 1 지도자 자격이 자동으로 나와요."],
      ["뱃지는 언제 받나요?", "심사 결과를 연맹에 등록한 뒤 뱃지와 인증서가 나오면 전달해 드려요."],
    ],
    cta: "주니어 등급 심사 예약하기",
    ctaSub: "날짜를 고르고 「주니어 등급 심사」를 선택하세요",
    lessons: "먼저 레슨으로 연습하기",
  },
  en: {
    eyebrow: "Junior Ski Badge",
    title: ["Junior Ski", "Badge Test"],
    desc: "Official junior ski grades of the Korea Ski Instructors Association (KSIA). Turn your child's progress into an official badge and certificate.",
    facts: [
      ["Ages 7–17", "Ski · 10 official levels"],
      ["2 hours", "Level check + test"],
      ["Official badge", "Badge & certificate when passed"],
      ["Level 7 bonus", "KSIA Level 1 instructor license at 18"],
    ],
    gradesTitle: "The 10 levels",
    gradesSub: "Each level has its own badge color. Children take one level at a time.",
    slope: { easy: "Green–blue slopes", mid: "Red slopes", hard: "Black slopes" },
    priceTitle: "Test prices",
    priceSub: "2 hours: we check the level, practice and test right away · association fee included",
    tierA: "Levels 1–6",
    tierB: "Levels 7–10",
    tierBNote: "Tested by a Level 3 examiner",
    ppl: { "1:1": "1 child", "1:2": "2 children (1 : 2)", "1:3": "3 children (1 : 3)" },
    total: "Total per group",
    plus: "+ lesson permit ₩25,000 per person · lift & rental 40% off",
    book: "Book this test",
    stepsTitle: "How it works",
    steps: [
      ["Consult", "Tell us your child's level and the target grade. If unsure, we recommend starting lower."],
      ["Warm-up & practice", "We practice the test elements together."],
      ["Test", "A certified KSIA instructor tests on the slope."],
      ["Registration", "We register the result with KSIA and pass on the badge and certificate."],
    ],
    incTitle: "Included",
    inc: ["2-hour session (1:1–1:3) + test", "KSIA test fee + badge & certificate issuing fee", "Photos & video of the test", "Badge & certificate when passed"],
    noteTitle: "Please note",
    notes: [
      "Passing is not guaranteed. Children can retake after more practice.",
      "One level per test.",
      "Ski only. Ask us about snowboard grades.",
      "Test dates may change with weather and slope conditions.",
      "If your child isn't ready yet, start with regular lessons or the 8-lesson season pack.",
    ],
    faqTitle: "FAQ",
    faq: [
      ["What ages?", "From age 7 to 17."],
      ["Can a first-timer take it?", "Level 1 (snowplow) is possible once your child can stop in a snowplow. Complete beginners should take a lesson first."],
      ["Why Level 7?", "Juniors who pass Level 7 automatically receive the KSIA Ski Level 1 instructor license at age 18."],
      ["When do we get the badge?", "After we register the result with KSIA, we pass on the badge and certificate."],
    ],
    cta: "Book a junior badge test",
    ctaSub: "Pick a date and choose “Junior Badge Test”",
    lessons: "Practice with a lesson first",
  },
  zh: {
    eyebrow: "Junior Ski Badge",
    title: ["青少年滑雪", "技术等级考核"],
    desc: "韩国滑雪指导者联盟（KSIA）官方青少年滑雪技术等级。用官方徽章和证书记录孩子的进步。",
    facts: [
      ["7~17周岁", "双板 · 官方10个等级"],
      ["2小时", "水平确认 + 考核"],
      ["官方徽章", "通过后颁发等级徽章·证书"],
      ["7级特权", "18岁自动获得指导者 Level 1"],
    ],
    gradesTitle: "10个等级",
    gradesSub: "每个等级的徽章颜色不同，每次挑战一个等级。",
    slope: { easy: "初级~初中级雪道", mid: "中高级雪道", hard: "高级雪道" },
    priceTitle: "考核费用",
    priceSub: "2小时内确认水平并直接考核 · 含联盟考试费及发证费",
    tierA: "1~6级考核",
    tierB: "7~10级考核",
    tierBNote: "由 Level 3 考官考核",
    ppl: { "1:1": "1人", "1:2": "2人（1:2）", "1:3": "3人（1:3）" },
    total: "整班费用",
    plus: "+ 教学许可证（挂牌）每人 ₩25,000 另计 · 缆车·装备6折",
    book: "预约此考核",
    stepsTitle: "流程",
    steps: [
      ["咨询", "告诉我们孩子目前的水平和想挑战的等级，不确定时建议从较低等级开始。"],
      ["热身·练习", "一起练习考核项目，调整动作。"],
      ["考核", "由联盟认证指导者在雪道上考核。"],
      ["登记结果", "向联盟登记结果后，转交徽章和证书。"],
    ],
    incTitle: "包含内容",
    inc: ["2小时课程（1:1~1:3）+ 考核", "联盟考试费 + 徽章·证书发证费", "考核照片·视频", "通过后颁发等级徽章·证书"],
    noteTitle: "注意事项",
    notes: [
      "不保证通过，未通过可练习后再次挑战。",
      "每次考核一个等级。",
      "仅限双板，单板等级请另行咨询。",
      "考核日程可能因天气·雪道情况变更。",
      "水平还不够时，建议先上普通课程或季节8次套餐。",
    ],
    faqTitle: "常见问题",
    faq: [
      ["几岁可以考？", "7周岁至17周岁。"],
      ["第一次滑雪可以考吗？", "能用犁式（A字）停下就可以挑战1级。完全零基础请先上课。"],
      ["考到7级有什么好处？", "通过青少年7级，满18岁时自动获得KSIA双板 Level 1 指导者资格。"],
      ["什么时候拿到徽章？", "向联盟登记结果后，徽章和证书发放时转交给您。"],
    ],
    cta: "预约青少年等级考核",
    ctaSub: "选择日期后选「青少年等级考核」",
    lessons: "先上课练习",
  },
} as const;

const won = (n: number, l: L) => (l === "ko" ? `${n.toLocaleString("ko-KR")}원` : `₩${n.toLocaleString("en-US")} (${approxUsd(n)})`);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : defaultLocale) as L;
  const t = T[l];
  return pageMetadata({
    locale: l,
    path: "junior/",
    title: t.title.join(" "),
    description: t.desc,
    image: { url: "/images/og-image-2627.jpg", alt: t.title.join(" ") },
  });
}

export default async function JuniorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : defaultLocale) as L;
  const t = T[l];
  const tiers: { p: JuniorProgram; title: string; note?: string; grades: string }[] = [
    { p: "junior-a", title: t.tierA, grades: "1–6" },
    { p: "junior-b", title: t.tierB, note: t.tierBNote, grades: "7–10" },
  ];
  const stepIcons = [<ClipboardCheck key="a" size={20} />, <Video key="b" size={20} />, <Medal key="c" size={20} />, <Award key="d" size={20} />];

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={[...t.title]} description={t.desc} />

      {/* 핵심 4개 */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
            {t.facts.map(([a, b]) => (
              <div key={a} className="rounded-2xl bg-ice-200 px-4 py-4 text-center">
                <p className="text-[18px] font-extrabold text-ink-900">{a}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-snow-600">{b}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 등급표 */}
      <section className="bg-ice-200 py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-[24px] font-bold text-ink-900 sm:text-[28px]">{t.gradesTitle}</h2>
            <p className="mt-2 text-[14px] text-snow-600">{t.gradesSub}</p>
            <ol className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {JUNIOR_GRADES.map((g) => (
                <li key={g.no} className="flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3 ring-1 ring-snow-300/60">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold"
                    style={{ background: g.color, boxShadow: `inset 0 0 0 3px ${g.ring}`, color: g.no === 7 ? "#fff" : "#111827" }}
                  >
                    {g.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ink-900">
                      {g.no}
                      {l === "ko" ? "등급" : l === "zh" ? "级" : ""} · {l === "ko" ? g.ko : l === "zh" ? g.zh : g.en}
                    </p>
                    <p className="text-[12.5px] text-snow-500">
                      {g.badge[l]} · {t.slope[g.slope]}
                    </p>
                  </div>
                  {g.no === 7 && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">Level 1</span>}
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 요금 */}
      <section id="price" className="scroll-mt-24 bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-[24px] font-bold text-ink-900 sm:text-[28px]">{t.priceTitle}</h2>
            <p className="mt-2 text-[14px] text-snow-600">{t.priceSub}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {tiers.map((tr) => (
                <div key={tr.p} className="flex flex-col rounded-3xl p-6 ring-1 ring-snow-300/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-bold text-brand-600">{tr.grades}</span>
                    <h3 className="text-[19px] font-bold text-ink-900">{tr.title}</h3>
                  </div>
                  {tr.note && <p className="mt-1 text-[12.5px] text-snow-500">{tr.note}</p>}
                  <ul className="mt-4 flex flex-col divide-y divide-snow-300/50">
                    {(["1:1", "1:2", "1:3"] as const).map((k) => {
                      const v = JUNIOR_PRICES[tr.p][k];
                      const n = Number(k.slice(2));
                      return (
                        <li key={k} className="flex items-baseline justify-between gap-3 py-2.5">
                          <span className="text-[14px] font-semibold text-ink-800">{t.ppl[k]}</span>
                          <span className="text-right">
                            <b className="text-[16px] text-ink-900">{won(v, l)}</b>
                            {n > 1 && <span className="block text-[11.5px] text-snow-500">{l === "ko" ? `1인 ${Math.round(v / n).toLocaleString("ko-KR")}원` : l === "zh" ? `每人 ₩${Math.round(v / n).toLocaleString("en-US")}` : `₩${Math.round(v / n).toLocaleString("en-US")} each`}</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-[12px] leading-relaxed text-snow-500">{t.plus}</p>
                  <Link
                    href={`/reserve?program=${tr.p}`}
                    className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-brand-500 text-[15px] font-bold text-white hover:bg-brand-600"
                  >
                    {t.book}
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-snow-500">
              {l === "ko" ? "※ 위 금액에 연맹 응시료 + 뱃지·인증서 발급료가 포함돼 있어요" : l === "zh" ? "※ 以上费用已含联盟考试费及徽章·证书发证费" : "※ Prices include the KSIA test fee and badge & certificate issuing fee"}
            </p>
          </div>
        </Container>
      </section>

      {/* 진행 + 포함 */}
      <section className="bg-ice-200 py-14 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            <article className="rounded-3xl bg-white p-7 ring-1 ring-snow-300/60">
              <h2 className="flex items-center gap-2 text-[19px] font-bold text-ink-900">
                <CalendarCheck size={20} className="text-brand-600" /> {t.stepsTitle}
              </h2>
              <ol className="mt-4 flex flex-col gap-3.5">
                {t.steps.map(([h, d], i) => (
                  <li key={h} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{stepIcons[i]}</span>
                    <div>
                      <p className="text-[15px] font-bold text-ink-900">
                        {i + 1}. {h}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-snow-600">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
            <div className="flex flex-col gap-4">
              <article className="rounded-3xl bg-white p-7 ring-1 ring-snow-300/60">
                <h2 className="flex items-center gap-2 text-[19px] font-bold text-ink-900">
                  <Award size={20} className="text-brand-600" /> {t.incTitle}
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {t.inc.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[14px] leading-relaxed text-snow-700">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-3xl bg-amber-50 p-7 ring-1 ring-amber-200">
                <h2 className="flex items-center gap-2 text-[19px] font-bold text-ink-900">
                  <ShieldCheck size={20} className="text-amber-600" /> {t.noteTitle}
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {t.notes.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[13.5px] leading-relaxed text-snow-700">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ + CTA */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-[24px] font-bold text-ink-900">{t.faqTitle}</h2>
            <div className="mt-5 flex flex-col gap-2.5">
              {t.faq.map(([q, a]) => (
                <details key={q} className="group rounded-2xl bg-ice-200 px-5 py-4">
                  <summary className="cursor-pointer list-none text-[15px] font-bold text-ink-900">Q. {q}</summary>
                  <p className="mt-2 text-[14px] leading-relaxed text-snow-700">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 rounded-3xl bg-ink-900 px-6 py-8 text-center text-white">
              <p className="text-[20px] font-bold">{t.cta}</p>
              <p className="mt-1.5 text-[13.5px] text-white/70">{t.ctaSub}</p>
              <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                <Link href="/reserve?program=junior-a" className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-500 px-7 text-[15px] font-bold text-white hover:bg-brand-600 sm:w-auto">
                  {t.book}
                </Link>
                <Link href="/lessons" className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/30 px-7 text-[15px] font-semibold text-white hover:bg-white/10 sm:w-auto">
                  {t.lessons}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
