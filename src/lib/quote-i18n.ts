"use client";

import { useEffect } from "react";
import { approxUsd } from "@/lib/usd";

/**
 * 연박 견적(견적 계산기 · 내 견적 · 견적서 사진) 영어·중국어 번역층
 * - 화면 소스는 한국어 그대로 두고, 영어·중국어 페이지에서는 화면 글자를 아래 규칙으로 바꿔 보여줘요.
 * - 사장님에게 가는 카톡 알림·문의 저장 내용은 한국어 그대로 유지돼요.
 * 규칙은 위에서부터 차례로 적용 (긴 문장 → 짧은 단어 순서)
 */
export type QLocale = "ko" | "en" | "zh";
type Rule = [RegExp | string, string | ((...m: string[]) => string), string | ((...m: string[]) => string)];

const WD_EN: Record<string, string> = { 일: "Sun", 월: "Mon", 화: "Tue", 수: "Wed", 목: "Thu", 금: "Fri", 토: "Sat" };
const WD_ZH: Record<string, string> = { 일: "周日", 월: "周一", 화: "周二", 수: "周三", 목: "周四", 금: "周五", 토: "周六" };
const krw = (n: number) => `₩${Math.round(n).toLocaleString("en-US")}`;
const NUMW_EN = ["", "one", "two", "three", "four", "five"];

const RULES: Rule[] = [
  ["(패찰·점심 포함) · 눌러서 바꾸기", "(permit & lunch incl.) · tap to switch", "（含教学许可·午餐）· 点击切换"],
  ["풀케어는 패찰 + 식사 포함 (원데이 점심 · 나이트 저녁) · 따로 낼 돈 없어요", "Full Care includes lesson permit + meal (One Day lunch · Night dinner) · nothing extra to pay", "Full Care含教学许可 + 餐食（One Day午餐 · Night晚餐）· 无需另付"],
  ["원데이 풀케어는 패찰 + 점심 식사 포함 · 따로 낼 돈 없어요", "One Day Full Care includes lesson permit + lunch · nothing extra to pay", "One Day Full Care含教学许可 + 午餐 · 无需另付"],
  ["나이트 풀케어는 패찰 + 저녁 식사 포함 · 따로 낼 돈 없어요", "Night Full Care includes lesson permit + dinner · nothing extra to pay", "Night Full Care含教学许可 + 晚餐 · 无需另付"],
  ["패찰·점심 포함", "permit & lunch incl.", "含许可·午餐"],
  [" · 7시간 풀케어(원데이·나이트)는 식사·사진·영상·패찰 포함", " · 7h Full Care (One Day · Night) includes meal, photos, video & permit", " · 7小时Full Care（One Day·Night）含餐·照片·视频·教学许可"],
  [/얼리버드: 2·3시간 강습료·풀케어 (\d+)% 할인 적용 중/g, "Early-bird: $1% off 2–3 hour lessons & Full Care", "早鸟：2·3小时课程和Full Care享$1%优惠"],
  [/얼리버드 ([\d.]+)만원/g, (_: string, n: string) => `Early-bird ₩${Math.round(+n * 10000).toLocaleString("en-US")}`, (_: string, n: string) => `早鸟 ₩${Math.round(+n * 10000).toLocaleString("en-US")}`],
  ["🏆 원데이·나이트 풀케어", "🏆 One Day · Night Full Care", "🏆 One Day · Night Full Care"],
  ["하루 레슨 7시간 · 식사·사진·영상·패찰 포함", "7 hours of lessons a day · meal, photos, video & permit included", "每天课程7小时 · 含餐·照片·视频·教学许可"],
  [/얼리버드 할인\((\S+)까지 예약\)은 2·3시간 강습료·풀케어\(원데이·나이트\)에만 적용돼요 · 패찰·리프트·장비·헬멧은 제외/g, "Early-bird (book by $1) applies to 2–3 hour lessons & Full Care (One Day · Night) only · not to permits, lift, rental or helmets", "早鸟优惠（$1前预订）仅适用于2·3小时课程和Full Care（One Day·Night）· 不含许可、缆车、装备和头盔"],
  ["💡 하루 2번이면", "💡 Two lessons a day?", "💡 一天两节课？"],
  ["원데이 풀케어 강추!", "One Day Full Care is our top pick!", "强烈推荐One Day Full Care！"],
  ["×2번", "×2", "×2"],
  ["13:30 미팅 · 오후 4시간 + 정설 후 야간 3시간 = 레슨 7시간 · 저녁 식사·사진·영상·패찰 포함", "Meet 13:30 · 4h afternoon + 3h night after grooming = 7 hours · dinner, photos, video & permit included", "13:30见面 · 下午4小时 + 压雪后夜间3小时 = 课程7小时 · 含晚餐·照片·视频·教学许可"],
  ["08:40 미팅 · 오전 3시간 30분 + 오후 3시간 30분 = 레슨 7시간 · 점심 식사·사진·영상·패찰 포함", "Meet 08:40 · 3.5h morning + 3.5h afternoon = 7 hours · lunch, photos, video & permit included", "08:40见面 · 上午3.5小时 + 下午3.5小时 = 课程7小时 · 含午餐·照片·视频·教学许可"],
  [/💡 하루 2번이면 원데이 풀케어 강추! (.+?)×2번 = (\S+) → 풀케어 7시간 = (\S+) \(점심 포함\) · 눌러서 바꾸기/g, "💡 Two lessons a day? One Day Full Care is our top pick! $1 ×2 = $2 → Full Care 7h = $3 (lunch incl.) · tap to switch", "💡 一天两节课？强烈推荐One Day Full Care！$1×2 = $2 → Full Care 7小时 = $3（含午餐）· 点击切换"],
  [/이날 (\d+)팀 합계/g, "This day, $1 groups total", "当天$1组合计"],
  ["이날 합계", "This day total", "当天合计"],
  ["(얼리버드 10% 반영)", "(early-bird 10% applied)", "（已含早鸟9折）"],
  ["원데이 풀케어", "One Day Full Care", "One Day Full Care"],
  ["나이트 풀케어", "Night Full Care", "Night Full Care"],
  ["풀케어 7시간", "Full Care 7h", "Full Care 7小时"],
  ["풀케어", "Full Care", "Full Care"],
  ["강추", "Top pick", "强烈推荐"],
  ["🎿 스키·보드 / 실력", "🎿 Ski or snowboard / level", "🎿 双板·单板 / 水平"],
  ["초급 = 처음이거나 초보 슬로프 · 중급 = 턴하며 중급 슬로프 · 상급 = 상급 슬로프·기술 연습", "Beginner = first time or easy slopes · Intermediate = can turn on intermediate slopes · Advanced = advanced slopes & technique", "初级 = 第一次或初级雪道 · 中级 = 能转弯滑中级雪道 · 高级 = 高级雪道·技术练习"],
  ["스키와 보드는 반을 따로 나눠요", "ski and snowboard are taught in separate groups", "双板和单板分开分组"],
  ["모두 스키", "All ski", "全部双板"],
  ["모두 보드", "All snowboard", "全部单板"],
  ["종목·실력:", "Sport & level:", "项目·水平："],
  ["14세 이상 (중학생부터)", "Age 14+ (middle school and up)", "14岁以上（初中生起）"],
  ["13세 이하 (초등학생까지)", "Age 13 and under (up to elementary school)", "13岁以下（小学生及以下）"],
  ["🎫 리프트 요금 나이 기준:", "🎫 Lift ticket age rule:", "🎫 缆车票年龄标准："],
  ["소인 = 13세 이하(초등학생까지)", "Child = age 13 and under (elementary school)", "儿童票 = 13岁以下（小学生及以下）"],
  ["대인 = 14세 이상(중학생부터)", "Adult = age 14+ (middle school and up)", "成人票 = 14岁以上（初中生起）"],
  [" · 강습은 만 4세부터 가능해요", " · lessons from age 4", " · 4周岁起可上课"],
  ["이름과 휴대폰 번호를 넣으면 보낼 수 있어요", "Enter your name and phone number to send", "填写姓名和手机号即可发送"],
  [/^인원$/, "Ratio", "师生比"],
  ["날짜마다 수업 1번 또는 2번을 골라주세요", "Choose once or twice for at least one day", "请至少为一天选择1次或2次"],
  ["반 나누는 방법을 골라주세요", "Choose how to split the groups", "请选择分组方式"],
  [/^일 \(당일\)$/, " day", " 天"],
  [/^일 \(\d+박 \d+일\)$/, " days", " 天"],
  ["내 견적 보기", "Show my quote", "查看我的报价"],
  // ── 긴 안내 문장 ──
  ["버튼만 눌러서 6단계면 끝. 날짜·인원·수업만 고르면 1인 금액이 나오고, 리프트·장비는 40% 할인가로 계산돼요.", "Six simple steps. Pick dates, people and lessons to see the price per person — lift tickets and rentals are calculated at 40% off.", "只需6步。选择日期、人数和课程即可看到每人价格，缆车票和装备按6折优惠计算。"],
  ["여러 팀·연박 견적,", "Family & multi-day", "家庭·多日课程"],
  ["한 번에 계산해요", "lesson quote", "一键报价"],
  ["오늘이 아니어도 괜찮아요 — 날짜 미정이면 주말 요금으로 넉넉하게 계산해요", "Not sure yet? Without dates we estimate at weekend rates.", "还没定日期？未定日期时按周末价格估算。"],
  ["첫날을 누르고, 마지막 날을 누르면 기간이 정해져요", "Tap your first day, then your last day", "先点第一天，再点最后一天"],
  ["마지막 날을 눌러주세요 (당일이면 같은 날을 한 번 더)", "Now tap your last day (tap the same day again for a single day)", "请点最后一天（只来一天就再点同一天）"],
  ["빨간 날(일·공휴일)", "Red days (Sun · holidays)", "红色日期（周日·节假日）"],
  ["은 리프트·장비 주말 요금이에요", " use weekend lift & rental rates", "适用缆车·装备周末价格"],
  ["과 ", " and ", "和"],
  ["아직 날짜가 안 정해졌어요", "No dates chosen yet", "还没选日期"],
  ["며칠 동안?", "How many days?", "几天？"],
  ["구경만 하는 분은 빼고 넣어주세요", "count only people taking lessons", "只算上课的人"],
  ["배울 사람 수를 넣어주세요", "Enter the number of students", "请输入学员人数"],
  [/모두 (\d+)명이 배워요/g, "$1 students", "共$1人上课"],
  ["초등학생 이하(리프트 소인) · 만 4세부터", "Elementary school age or younger (child lift rate) · from age 4", "小学生及以下（儿童票）· 4岁起"],
  ["중학생 이상", "Age 14+", "14岁以上"],
  ["날짜마다 순서대로 골라주세요", "Choose for each day", "请按日期依次选择"],
  ["몇 번 → 몇 시간 → 몇 교시 (날마다 달라도 돼요)", "How many → how long → which time (can differ each day)", "几次 → 几小时 → 哪个时段（每天可以不同）"],
  ["하루 2번이면 중간에 점심 먹고 쉬어요 · 2시간 수업은 1+3교시 또는 2+4교시를 추천드려요", "Two lessons a day include a lunch break · for 2-hour lessons we recommend periods 1+3 or 2+4", "一天两节课中间有午休 · 2小时课程推荐第1+3节或第2+4节"],
  ["강사 1명이 최대 3명까지 가르쳐요. 실력·나이가 비슷한 분끼리 묶어드려요.", "One instructor teaches up to 3 students. We group people of similar level and age.", "每位教练最多教3人，我们会把水平和年龄相近的人分在一组。"],
  ["다른 방법으로 나누기", "Other ways to split", "其他分组方式"],
  ["강사 1명당 3명까지", "Up to 3 per instructor", "每位教练最多3人"],
  ["강사 1명당 2명까지", "Up to 2 per instructor", "每位教练最多2人"],
  ["한 명에 강사 한 명", "One instructor each", "一人一位教练"],
  ["알뜰하게", "Best value", "最划算"],
  ["소수정예", "Small group", "小班"],
  ["1:1 전담", "Private 1:1", "1对1专属"],
  ["이름을 넣고 사람마다 골라주세요. (필요 없으면 그냥 다음)", "Add names and choose for each person (skip if not needed).", "填写姓名并为每人选择（不需要可直接下一步）。"],
  ["지노스키 손님은 리프트·장비", "JinoSki students get lift & rental", "JinoSki学员缆车·装备享"],
  ["40% 할인가", "40% off price", "6折价格"],
  ["40% 할인", "40% off", "6折优惠"],
  ["모두 한 번에:", "Set all:", "全部设为："],
  ["모두 필요없음", "None for all", "全部不需要"],
  ["모두 리프트만", "Lift only for all", "全部只要缆车"],
  ["모두 리프트+장비", "Lift + rental for all", "全部缆车+装备"],
  ["헬멧 모두", "Helmets for all", "全部租头盔"],
  ["✓ 강습 포함", "✓ Lesson included", "✓ 含课程"],
  ["헬멧은 수업 있는 날 기준 · 할인 제외 (기본 5,000원 · 바이저 15,000원)", "Helmets are per lesson day · not discounted (basic ₩5,000 · visor ₩15,000)", "头盔按上课天数计 · 不打折（普通₩5,000 · 带护目镜₩15,000）"],
  ["· 수업 시간표에 맞춰 자동 추천", "· recommended from your lesson times", "· 按课程时间自动推荐"],
  ["장비는 리프트보다 1시간 길게 자동으로 맞춰요 (3시간 → 장비 4시간)", "Rental is automatically 1 hour longer than the lift ticket (3h → 4h rental)", "装备时间自动比缆车多1小时（3小时 → 装备4小时）"],
  ["이날은 리프트·장비 안 써요", "No lift or rental this day", "当天不需要缆车和装备"],
  ["의류는 제휴 렌탈샵 안내 드립니다.^^", "Ski wear: we'll recommend our partner rental shop.", "滑雪服：我们会介绍合作租赁店。"],
  ["패찰 포함 · 매 수업 사진·영상 무료", "Lesson permit included · free photos & video every lesson", "含教学许可 · 每节课免费拍照录像"],
  ["얼리버드 강습료 10% 할인 ·", "Early-bird 10% off lessons ·", "早鸟课程9折 ·"],
  [/(\S+) 아꼈어요/g, "you save $1", "节省$1"],
  ["현장에서 리프트권·장비·헬멧을 이대로 준비해 드려요", "We'll have lift tickets, rentals and helmets ready on site as listed", "我们会在现场按此准备缆车票、装备和头盔"],
  ["시간표 · 자세한 내역 보기", "Timetable & details", "时间表·详细明细"],
  ["(반별 평균)", "(average across groups)", "（各组平均）"],
  ["날짜별 평일·주말 요금", "weekday/weekend rates by date", "按日期区分平日/周末价格"],
  ["날짜 미정이라 주말 요금", "weekend rates (no dates yet)", "未定日期按周末价格"],
  ["공휴일은 주말 요금", "holidays use weekend rates", "节假日按周末价格"],
  ["강습료만 (패찰 포함 · 얼리버드 반영)", "Lessons only (incl. permit · early-bird applied)", "仅课程费（含许可·已含早鸟）"],
  ["장비료만 (리프트·장비 40% 할인 + 헬멧)", "Lift & rental only (40% off + helmets)", "仅缆车·装备（6折 + 头盔）"],
  ["토탈 금액 보기", "Show total", "查看总价"],
  ["이미지 만드는 중...", "Creating image...", "正在生成图片..."],
  ["저장 완료! 카톡으로 보내주세요", "Saved! Send it to us on KakaoTalk", "已保存！请通过KakaoTalk发给我们"],
  ["견적서 사진으로 저장", "Save quote as image", "保存报价图片"],
  ["카톡으로 상담하기", "Chat on KakaoTalk", "KakaoTalk咨询"],
  ["✓ 견적 내용이 복사됐어요 · 카톡 채팅창에 붙여넣기만 하세요", "✓ Quote copied · just paste it into the KakaoTalk chat", "✓ 报价已复制 · 粘贴到KakaoTalk聊天即可"],
  ["저장한 사진(또는 화면 캡처)을 카톡 「지노스키」로 보내주시면 바로 확인해 드려요", "Send the saved image to 「JinoSki」 on KakaoTalk — no KakaoTalk? Just use the form below and we'll contact you.", "把保存的图片发到KakaoTalk「JinoSki」— 没有KakaoTalk？直接填写下方表格，我们会联系您。"],
  [/✓ 접수됐어요! 강사 일정을 확인해서 (.+)로 연락드릴게요\./g, "✓ Received! We'll check instructor availability and contact you at $1.", "✓ 已收到！我们确认教练安排后会联系$1。"],
  ["답변은 「내 견적 확인」에서 휴대폰 번호 + 비밀번호로 볼 수 있어요 →", "See our reply in 「My Quote」 with your phone number + password →", "可在「我的报价」用手机号+密码查看回复 →"],
  ["수정한 견적 다시 보내기", "Send updated quote", "重新发送修改后的报价"],
  ["일정·인원·리프트를 바꾸면 여기서 수정한 견적을 바로 다시 보낼 수 있어요", "If you change dates, people or lifts, you can resend the updated quote here", "如果修改日期、人数或缆车，可在这里重新发送"],
  ["연락처 남기고 견적 받기", "Leave your contact to get a quote", "留下联系方式获取报价"],
  ["비밀번호 4자리 이상 · 답변 확인용 (선택)", "Password (4+ digits) · to view our reply (optional)", "密码（4位以上数字）· 用于查看回复（可选）"],
  ["비밀번호를 정해두면 「내 견적 확인」에서 견적서와 지노스키 답변을 다시 볼 수 있어요", "With a password you can view your quote and our reply later in 「My Quote」", "设置密码后可在「我的报价」查看报价和回复"],
  ["특이사항 · 강사 배정 희망", "Notes · instructor preference", "备注 · 教练偏好"],
  ["반이 2개 이상일 때 여자·남자 선생님을 섞어서 배정해 드려요", "With 2+ groups we'll mix female and male instructors", "2组以上时会安排男女教练搭配"],
  ["요청사항 (선택) · 아이 나이, 실력 등", "Requests (optional) · kids' ages, level, English-speaking instructor, etc.", "需求（可选）· 孩子年龄、水平、中文教练等"],
  ["보내는 중...", "Sending...", "发送中..."],
  ["견적 문의 보내기", "Send quote request", "发送报价咨询"],
  ["전송이 안 됐어요. 카톡으로 상담해 주세요.", "Couldn't send. Please contact us on KakaoTalk.", "发送失败，请通过KakaoTalk咨询。"],
  ["링크 복사됨", "Link copied", "链接已复制"],
  ["견적 링크 복사", "Copy quote link", "复制报价链接"],
  ["견적 글 복사", "Copy quote text", "复制报价文字"],
  ["복사됨", "Copied", "已复制"],
  ["처음부터 다시 고르기", "Start over", "重新选择"],
  ["날짜 미정으로 다음", "Next without dates", "不定日期，下一步"],
  ["견적 보기", "See quote", "查看报价"],
  ["강습료만 표시 · 패찰은 견적에 자동 포함 · 다음 단계에서 다른 방법으로도 나눌 수 있어요", "Lesson fee only · permit added automatically · you can split differently in the next step", "仅显示课程费 · 许可费自动计入 · 下一步可选择其他分组"],
  ["강습료 (1회 · 강사 1명 기준)", "Lesson fee (per lesson · one instructor)", "课程费（每节 · 一位教练）"],
  ["— 견적에 자동으로 포함돼요", "— added to the quote automatically", "— 自动计入报价"],
  ["+ 패찰(강습 허가권) 1인", "+ Lesson permit per person:", "+ 教学许可每人"],
  ["슬로프를 정비하는 시간이라 수업이 없어요. 야간 강습은 정설이 끝난 뒤 시작해요.", "Slopes are being groomed, so there are no lessons. Night lessons start after grooming.", "雪道整修时间，不上课。夜间课程在整修后开始。"],
  ["저녁 정설", "Evening grooming", "傍晚整雪"],
  ["수업 시간표", "Lesson timetable", "课程时间表"],
  ["비발디파크 매표소 요금 안내판 (현장 사진) · 이 정가에서", "Vivaldi Park ticket office price board (photo) · we take", "维瓦尔第公园售票处价格表（现场照片）· 在此原价上"],
  ["해 계산해요 · 누르면 크게 보여요", " these prices · tap to enlarge", "计算 · 点击放大"],
  ["단위 원 · 주말에는 공휴일 포함 · 헬멧·의류는 할인 제외", "KRW · weekend includes holidays · helmets & clothing not discounted", "单位韩元 · 周末含节假日 · 头盔·服装不打折"],
  ["13세 이하(초등학생, 한국 나이 · 3월 중학교 입학 예정자 포함)", "elementary school age or younger", "小学生及以下"],
  ["14세 이상", "age 14+", "14岁以上"],
  ["이 손님은 비밀번호가 없어", "", ""],
  // ── 내 견적 · 견적서 사진 ──
  ["견적 문의 때 넣은 휴대폰 번호와 비밀번호로 견적서와 지노스키 답변을 볼 수 있어요.", "Enter the phone number and password you used when sending your quote to see it and our reply.", "输入咨询时填写的手机号和密码，即可查看报价单和JinoSki的回复。"],
  ["휴대폰 번호와 비밀번호(4자리 이상)를 넣어주세요.", "Please enter your phone number and password (4+ digits).", "请输入手机号和密码（4位以上数字）。"],
  ["일치하는 견적이 없어요. 휴대폰 번호와 비밀번호를 확인해 주세요.", "No matching quote. Please check your phone number and password.", "没有找到匹配的报价，请检查手机号和密码。"],
  ["너무 많이 시도했어요. 1시간 뒤에 다시 해주세요.", "Too many attempts. Please try again in an hour.", "尝试次数过多，请1小时后再试。"],
  ["잠시 후 다시 시도해 주세요.", "Please try again shortly.", "请稍后再试。"],
  ["비밀번호를 잊으셨으면 카톡 「지노스키」로 문의해 주세요 ·", "Forgot your password? Message 「JinoSki」 on KakaoTalk ·", "忘记密码请通过KakaoTalk「JinoSki」联系 ·"],
  ["아직 답변 전이에요. 강사 일정 확인 후 답변 드릴게요.", "No reply yet. We'll reply after checking instructor availability.", "还没有回复，确认教练安排后会回复您。"],
  ["사진을 찾을 수 없어요. (보관 기간 90일이 지났거나 주소가 잘못됐어요)", "Image not found. (It's kept for 90 days, or the link is wrong.)", "找不到图片。（保存期限90天已过或链接有误）"],
  ["사진을 길게 누르면 저장할 수 있어요", "Long-press the image to save it", "长按图片即可保存"],
  ["견적 다시 보기 · 수정하기", "Open · edit quote", "查看·修改报价"],
  ["접수됨 · 확인 중", "Received · checking", "已收到 · 确认中"],
  ["견적서 크게 보기", "Enlarge quote", "放大报价单"],
  ["다른 번호로 보기", "Use another number", "换个号码查看"],
  ["지노스키 답변", "JinoSki reply", "JinoSki回复"],
  ["새 견적 내기", "New quote", "新报价"],
  ["휴대폰 번호를 확인해 주세요 (숫자 9자리 이상)", "Please check your phone number (at least 9 digits)", "请检查手机号（至少9位数字）"],
  ["휴대폰 번호", "Phone number (with country code)", "手机号（含国家区号）"],
  ["비밀번호", "Password", "密码"],
  ["찾는 중...", "Searching...", "查找中..."],
  ["견적 수정", "Updated quote", "修改的报价"],
  ["상담 중", "In discussion", "咨询中"],
  ["예약 확정", "Booking confirmed", "预约已确认"],
  ["종료", "Closed", "已结束"],
  ["사진 저장", "Save image", "保存图片"],
  ["닫기", "Close", "关闭"],
  // ── 견적서 이미지 ──
  ["가족·연박 견적서", "Family & multi-day quote", "家庭·连住报价单"],
  ["비발디파크 스키·보드 강습", "Vivaldi Park ski & snowboard lessons", "维瓦尔第公园 双板·单板课程"],
  [/(\d+\.\d+\.\d+) 기준/g, "as of $1", "截至$1"],
  [/문의 {2}(.+?) {2}· {2}카카오톡 「지노스키」/g, "Contact  $1  ·  KakaoTalk 「JinoSki」", "咨询  $1  ·  KakaoTalk「JinoSki」"],
  ["이 이미지를 카톡으로 보내주시면 바로 확인해 드려요", "send us this image on KakaoTalk and we'll check right away", "把此图片通过KakaoTalk发给我们即可马上确认"],
  ["포함 내역", "What's included", "包含内容"],
  ["금액 내역", "Price details", "金额明细"],
  ["시간표", "Timetable", "时间表"],
  ["매 수업 사진·영상 무료", "free photos & video every lesson", "每节课免费拍照录像"],
  ["헬멧 할인 제외", "helmets not discounted", "头盔不打折"],
  ["예상 견적이에요. 강사 일정 확인 후 확정 금액을 안내드려요.", "This is an estimate. We'll confirm the final price after checking instructor availability.", "此为预估报价，确认教练安排后告知最终金额。"],
  [/얼리버드 10%는 강습료에만 적용 \(-(\S+)\)/g, "Early-bird 10% applies to lessons only (-$1)", "早鸟9折仅适用于课程费（-$1）"],
  ["얼리버드 강습료 10% 반영", "early-bird 10% applied", "已含早鸟9折"],
  [/강사 희망: /g, "Instructor preference: ", "教练偏好："],
  [/\(정가 (\S+)\)/g, "(regular $1)", "（原价$1）"],
  // ── 쪼개진 글자 이어 붙인 문장 ──
  [/(\d+)일 \(당일\)/g, (_: string, n: string) => `${n} day (single day)`, "$1天（当日）"],
  ["토요일", "Saturdays", "周六"],
  ["크게 보기", "Enlarge", "放大"],
  [/(\d+)명이면 강사 1명이 가르쳐요/g, "$1 people → one instructor", "$1人 → 一位教练"],
  [/어른 (\d+)명/g, "$1 adults", "成人$1人"],
  [/어린이 (\d+)명/g, "$1 children", "儿童$1人"],
  [/어른(\d+)/g, "Adults $1", "成人$1"],
  [/어린이(\d+)/g, "Children $1", "儿童$1"],
  [/어른 (\d+)/g, "Adult $1", "成人$1"],
  [/어린이 (\d+)/g, "Child $1", "儿童$1"],
  ["내 견적 확인", "My Quote", "我的报价"],
  ["내 견적", "My Quote", "我的报价"],
  // ── 견적 글(복사용) ──
  ["[지노스키 견적]", "[JinoSki Quote]", "[JinoSki 报价]"],
  ["■ 일정", "■ Schedule", "■ 日程"],
  ["날짜별 일정", "custom schedule by day", "按日期安排"],
  ["기간:", "Dates:", "日期："],
  ["인원:", "People:", "人数："],
  [/수업: 총 (\d+)회/g, (_: string, n: string) => `Lessons: ${n} total`, "课程：共$1节"],
  [/1회 약 (\S+) × (\d+)회/g, "≈ $1 per lesson × $2", "每节约$1 × $2节"],
  ["패찰 포함", "permit incl.", "含许可"],
  ["1인 금액", "Price per person", "每人金额"],
  ["예상 합계", "Estimated total", "预计合计"],
  ["1인당 금액", "Price per person", "每人费用"],
  ["리프트·장비", "Lift·rental", "缆车·装备"],
  ["(원)", "(KRW)", "(韩元)"],
  [/총 합계 \((\d+)명\)/g, "Grand total ($1 ppl)", "总计（$1人）"],
  [/얼리버드 강습료 10% 할인 -(\S+) 반영/g, "early-bird 10% off lessons -$1 applied", "已含早鸟课程9折 -$1"],
  ["강사 일정 확인 후 확정", "final after checking instructor availability", "确认教练安排后确定"],
  ["날짜별:", "By day:", "按日期："],
  ["■ 날짜별 합계", "■ Total by day", "■ 按日期合计"],
  // ── 단계 제목 ──
  ["언제 오세요?", "When are you coming?", "什么时候来？"],
  ["몇 명이 배우세요?", "How many students?", "几位学员？"],
  ["수업은 어떻게 할까요?", "Plan your lessons", "安排课程"],
  ["반은 어떻게 나눌까요?", "How to split into groups?", "如何分组？"],
  ["리프트·장비도 필요하세요?", "Need lift tickets & rentals?", "需要缆车票和装备吗？"],
  ["견적서", "Your quote", "报价单"],
  // ── 결과·합계 ──
  ["개인별 금액", "Price per person", "每人价格"],
  ["날짜별 준비표", "Daily prep list", "每日准备清单"],
  ["리프트·장비 없음", "No lift or rental", "无缆车和装备"],
  ["강습료 (패찰 포함)", "Lessons (incl. permit)", "课程费（含许可）"],
  ["리프트·장비 (40% 할인)", "Lift & rental (40% off)", "缆车·装备（6折）"],
  ["강습료 합계", "Lesson total", "课程费合计"],
  ["장비료 합계", "Lift & rental total", "缆车·装备合计"],
  ["1인 1회 강습료", "Lesson price per person per lesson", "每人每节课程费"],
  ["강습료만", "Lessons only", "仅课程费"],
  ["장비료만", "Lift & rental", "缆车·装备"],
  ["날짜별", "By day", "按日期"],
  ["개인별", "By person", "按人"],
  ["토탈", "Total", "总计"],
  ["전체", "All", "全部"],
  ["반 나누기", "Groups", "分组"],
  ["강습만", "Lesson only", "仅课程"],
  ["리프트+장비", "Lift + rental", "缆车+装备"],
  ["+ 리프트·장비", "+ lift & rental", "+ 缆车·装备"],
  ["+ 리프트", "+ lift", "+ 缆车"],
  ["리프트만", "Lift only", "仅缆车"],
  ["필요없음", "None", "不需要"],
  ["헬멧 있음", "Own helmet", "自带头盔"],
  ["바이저 헬멧", "Visor helmet", "带护目镜头盔"],
  ["기본 헬멧", "Basic helmet", "普通头盔"],
  ["헬멧 5천", "Helmet ₩5K", "头盔5千"],
  ["바이저 1.5만", "Visor ₩15K", "护目镜1.5万"],
  ["공휴일·주말 요금", "Holiday", "节假日价"],
  ["주말 요금(날짜 미정)", "Weekend (no date)", "周末价（未定日期）"],
  ["주말 요금", "Weekend", "周末价"],
  ["주중 요금", "Weekday", "平日价"],
  ["주중 대인", "Weekday adult", "平日成人"],
  ["주중 소인", "Weekday child", "平日儿童"],
  ["주말 대인", "Weekend adult", "周末成人"],
  ["주말 소인", "Weekend child", "周末儿童"],
  ["1인 1일", "Per person / day", "每人每天"],
  ["상관없음", "No preference", "无所谓"],
  ["여자+남자 섞어서", "Mix of female & male", "男女教练搭配"],
  ["여자 선생님", "Female instructor", "女教练"],
  ["남자 선생님", "Male instructor", "男教练"],
  ["(선택)", "(optional)", "（可选）"],
  ["모두 1번", "Once every day", "每天1次"],
  ["모두 2번", "Twice every day", "每天2次"],
  ["수업 시간", "Lesson length", "课程时长"],
  ["수업 없음", "No lesson", "无课程"],
  ["수업 날", "Lesson day", "上课日"],
  ["안 함", "None", "不上"],
  ["안 씀", "None", "不用"],
  [" 추천", " recommended", " 推荐"],
  ["추천", "Recommended", "推荐"],
  ["날짜 미정", "Date TBD", "日期未定"],
  ["당일", "Single day", "当日"],
  ["이전 달", "Previous month", "上个月"],
  ["다음 달", "Next month", "下个月"],
  ["이전", "Back", "上一步"],
  ["다음", "Next", "下一步"],
  ["이름", "Name", "姓名"],
  ["연락처", "Phone / email", "电话/邮箱"],
  ["인원", "People", "人数"],
  ["공휴일", "Holiday", "节假日"],
  ["주말공휴일", "Weekend/Holiday", "周末节假日"],
  ["주말", "Weekend", "周末"],
  ["주중", "Weekday", "平日"],
  ["어린이", "Child", "儿童"],
  ["어른", "Adult", "成人"],
  ["소인", "Child", "儿童"],
  ["대인", "Adult", "成人"],
  ["줄이기", "Decrease", "减少"],
  ["늘리기", "Increase", "增加"],
  // ── 숫자가 들어간 표현 ──
  [/(\d+)명이면 강사 (\d+)명 · \S+ 팀으로 나눠요/g, (_: string, p: string, n: string) => `${p} people → ${n} instructors, ${NUMW_EN[+n] ?? n} groups`, (_: string, p: string, n: string) => `${p}人 → ${n}位教练，分${n}组`],
  [/(\d+)명이면 강사 1명이 가르쳐요/g, "$1 people → one instructor", "$1人 → 一位教练"],
  [/총 수업 (\d+)회/g, "Total: $1 lessons", "共$1节课"],
  [/개인별 금액 \((\d+)회 기준\)/g, (_: string, n: string) => `Price per person (${n} lesson${n === "1" ? "" : "s"})`, "每人价格（共$1节）"],
  [/(\d+)박 (\d+)일/g, (_: string, n: string, d: string) => `${d} days (${n} night${+n > 1 ? "s" : ""})`, "$2天$1晚"],
  [/(\d+)일차 합계/g, "Day $1 total", "第$1天合计"],
  [/(\d+)일차/g, "Day $1", "第$1天"],
  [/(^|[\s/|·(])(\d+)일 (?=\d|수업|리프트|안 씀|None|No)/g, "$1Day $2 ", "$1第$2天 "],
  [/(\d+)일 \(/g, "$1 days (", "$1天（"],
  [/(첫째|둘째|셋째|넷째|다섯째|여섯째|일곱째|여덟째|아홉째|열째) 날/g, (_: string, w: string) => `Day ${["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째", "열째"].indexOf(w) + 1}`, (_: string, w: string) => `第${["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째", "열째"].indexOf(w) + 1}天`],
  [/(\d+)번째? 날/g, "Day $1", "第$1天"],
  [/1인 1회 약 (\S+)/g, "$1 / person / lesson", "每人每节约 $1"],
  ["1인 1회", "per person / lesson", "每人每节"],
  [/(\d+)시간권/g, "$1h pass", "$1小时票"],
  [/(\d)\+(\d)교시/g, "Periods $1+$2", "第$1+$2节"],
  ["5교시(야간)", "Period 5 (night)", "第5节（夜间）"],
  [/(\d)교시/g, "Period $1", "第$1节"],
  ["오전+오후", "Morning + Afternoon", "上午+下午"],
  ["오전+야간", "Morning + Night", "上午+夜间"],
  ["오후+야간", "Afternoon + Night", "下午+夜间"],
  [/(\d+)시간 수업/g, "$1-hour lessons", "$1小时课程"],
  [/(\d+)시간/g, "$1h", "$1小时"],
  [/(\d+)번/g, (_: string, n: string) => (n === "1" ? "Once" : n === "2" ? "Twice" : `${n}×`), "$1次"],
  [/수업 (\d+)회/g, (_: string, n: string) => (n === "1" ? "1 lesson" : `${n} lessons`), "$1节课"],
  [/(\d+)회 기준/g, (_: string, n: string) => (n === "1" ? "1 lesson" : `${n} lessons`), "共$1节"],
  [/(\d+)회/g, (_: string, n: string) => (n === "1" ? "1 lesson" : `${n} lessons`), "$1节"],
  [/강사 (\d+)명/g, (_: string, n: string) => `${n} instructor${+n > 1 ? "s" : ""}`, "$1位教练"],
  [/(\d+)명×(\d+)/g, "$1 × $2", "$1人×$2"],
  [/(\d+)명(?=\+)/g, "$1", "$1人"],
  [/(\d+)명/g, (_: string, n: string) => (n === "1" ? "1 person" : `${n} people`), "$1人"],
  [/(\d+)반/g, "Group $1", "第$1组"],
  [/아이 (\d+)/g, "Child $1", "儿童$1"],
  [/(\d+)세부터/g, "from age $1", "$1岁起"],
  [/1인 (\d+(?:\.\d+)?)만/g, (_: string, n: string) => `each ₩${Math.round(+n * 10)}K (${approxUsd(+n * 10000)})`, (_: string, n: string) => `每人${n}万 (${approxUsd(+n * 10000)})`],
  [/(\d+(?:\.\d+)?)만원?/g, (_: string, n: string) => `₩${Math.round(+n * 10)}K (${approxUsd(+n * 10000)})`, (_: string, n: string) => `₩${n}万 (${approxUsd(+n * 10000)})`],
  [/([\d,]+)원/g, (_: string, n: string) => `₩${n} (${approxUsd(+n.replace(/,/g, ""))})`, (_: string, n: string) => `₩${n} (${approxUsd(+n.replace(/,/g, ""))})`],
  [/약 /g, "≈ ", "约 "],
  [/(\d+)년 (\d+)월/g, (_: string, y: string, m: string) => `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m - 1]} ${y}`, "$1年$2月"],
  [/\((일|월|화|수|목|금|토)\)/g, (_: string, d: string) => `(${WD_EN[d]})`, (_: string, d: string) => `(${WD_ZH[d]})`],
  [/^(일|월|화|수|목|금|토)$/g, (_: string, d: string) => WD_EN[d], (_: string, d: string) => WD_ZH[d].slice(1)],
  ["오전", "Morning", "上午"],
  ["오후", "Afternoon", "下午"],
  ["야간", "Night", "夜间"],
  ["강습료", "Lesson fee", "课程费"],
  ["반영", "applied", "已计入"],
  ["강습", "Lesson", "课程"],
  ["리프트", "Lift", "缆车"],
  ["장비", "Rental", "装备"],
  ["헬멧", "Helmet", "头盔"],
  ["바이저", "Visor", "护目镜"],
  ["패찰", "Permit", "许可"],
  ["강사", "Instructor", "教练"],
  ["반", "Group", "组"],
  ["얼리버드", "Early-bird", "早鸟"],
  ["합계", "Total", "合计"],
  ["없음", "None", "无"],
  ["기본", "Basic", "普通"],
  ["수업", "Lesson", "课"],
  ["비발디파크", "Vivaldi Park", "维瓦尔第公园"],
  ["매표소", "ticket office", "售票处"],
  ["요금표", "price list", "价格表"],
  ["요금", "rates", "价格"],
  ["렌탈", "Rental", "租赁"],
  ["초급", "Beginner", "初级"],
  ["중급", "Intermediate", "中级"],
  ["상급", "Advanced", "高级"],
  ["스키", "Ski", "双板"],
  ["보드", "Snowboard", "单板"],
  ["1인", "per person", "每人"],
  ["견적", "Quote", "报价"],
  ["카톡", "KakaoTalk", "KakaoTalk"],
  ["지노스키", "JinoSki", "JinoSki"],
];

const HANGUL = /[가-힣]/;

/** 한국어 문장을 영어·중국어로 (규칙에 없는 부분은 그대로) */
export function trQuote(text: string, locale: QLocale): string {
  if (locale === "ko" || !text || !HANGUL.test(text)) return text;
  let s = text;
  const col = locale === "en" ? 1 : 2;
  for (const r of RULES) {
    if (!HANGUL.test(s)) break;
    const pat = r[0];
    const rep = r[col] as string | ((...m: string[]) => string);
    if (typeof pat === "string") {
      if (s.includes(pat)) s = s.split(pat).join(typeof rep === "string" ? rep : rep(pat));
    } else {
      pat.lastIndex = 0;
      s = typeof rep === "string" ? s.replace(pat, rep) : s.replace(pat, rep as (...m: string[]) => string);
    }
  }
  return s;
}

const ATTRS = ["placeholder", "aria-label", "title", "alt"];

// React가 넣은 원래 글자(SRC)와 우리가 바꿔 넣은 글자(MINE)를 따로 기억해요
// → 숫자와 글자가 쪼개진 문장({n}명이면…)도 이어 붙여 번역하고, 무한 반복을 막아요
const SRC = new WeakMap<Node, string>();
const MINE = new WeakMap<Node, string>();
function srcOf(n: Node): string {
  const v = n.nodeValue ?? "";
  if (MINE.has(n) && MINE.get(n) === v) return SRC.get(n) ?? v;
  SRC.set(n, v);
  MINE.delete(n);
  return v;
}
function put(n: Node, t: string) {
  MINE.set(n, t);
  if (n.nodeValue !== t) n.nodeValue = t;
}
function doTexts(el: Element, locale: QLocale) {
  // 서로 붙어 있는 글자 조각끼리 묶어요 (서버 렌더링의 <!-- --> 주석은 건너뜀)
  const runs: Node[][] = [];
  let cur: Node[] = [];
  el.childNodes.forEach((k) => {
    if (k.nodeType === Node.TEXT_NODE) cur.push(k);
    else if (k.nodeType === Node.COMMENT_NODE) return;
    else if (cur.length) {
      runs.push(cur);
      cur = [];
    }
  });
  if (cur.length) runs.push(cur);
  for (const run of runs) {
    const joined = run.map(srcOf).join("");
    if (!HANGUL.test(joined)) continue;
    const t = trQuote(joined, locale);
    run.forEach((k, i) => put(k, i === 0 ? t : ""));
  }
}
function translateTree(root: Node, locale: QLocale) {
  const start = root.nodeType === Node.ELEMENT_NODE ? (root as Element) : root.parentElement;
  if (!start || start.closest("[data-notr]")) return;
  const els = [start, ...Array.from(start.querySelectorAll("*"))];
  for (const el of els) {
    if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.closest("[data-notr]")) continue;
    doTexts(el, locale);
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (v && HANGUL.test(v)) {
        const t = trQuote(v, locale);
        if (t !== v) el.setAttribute(a, t);
      }
    }
  }
}

export function useQuoteTranslate(rootId: string, locale: QLocale) {
  useEffect(() => {
    if (locale === "ko") return;
    const root = document.getElementById(rootId);
    if (!root) return;
    translateTree(root, locale);
    const obs = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === "characterData") translateTree(m.target, locale);
        else if (m.type === "attributes") translateTree(m.target, locale);
        else {
          translateTree(m.target, locale);
        }
      }
    });
    obs.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return () => obs.disconnect();
  }, [rootId, locale]);
}

/** 객체 안 모든 문자열을 번역 (견적서 이미지 데이터용) */
export function trDeep<T>(v: T, locale: QLocale): T {
  if (locale === "ko") return v;
  if (typeof v === "string") return trQuote(v, locale) as T;
  if (Array.isArray(v)) return v.map((x) => trDeep(x, locale)) as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) o[k] = trDeep(x, locale);
    return o as T;
  }
  return v;
}

export function asQLocale(l: string): QLocale {
  return l === "en" || l === "zh" ? l : "ko";
}
