// 개인정보처리방침 — 개인정보 보호법 제30조에 따른 공개 문서
// ※ 내용이 바뀌면 effectiveDate 와 해당 항목을 함께 수정하세요.
export type PrivacySection = { title: string; body: string[] };
export type PrivacyContent = {
  title: string;
  intro: string;
  effectiveDate: string;
  sections: PrivacySection[];
  footerLink: string;
  formNotice: string;
};

const ko: PrivacyContent = {
  title: "개인정보처리방침",
  intro:
    "지노컴퍼니(이하 '지노스키')는 「개인정보 보호법」 등 관련 법령을 지키며, 고객님의 개인정보를 소중하게 다룹니다. 이 방침은 jinoski.com 및 지노스키의 예약·상담 과정에서 개인정보가 어떻게 수집·이용·보관되는지 알려드리기 위한 것입니다.",
  effectiveDate: "시행일: 2026년 10월 4일",
  sections: [
    {
      title: "1. 수집하는 개인정보 항목",
      body: [
        "레슨 예약 신청: 이름, 휴대전화번호, 희망 날짜·시간대, 프로그램·인원, 종목, 실력 수준, 연령대, 요청사항",
        "인생사진(스냅 촬영) 신청: 이름, 휴대전화번호, 희망 날짜·시간대, 패키지·추가 인화 옵션, 받는 방법, 요청사항",
        "택배 수령을 선택한 경우(예약 확정 후 별도 안내): 받는 분 이름, 주소, 연락처",
        "카카오톡 채널·문자 상담 시: 상담 과정에서 고객님이 직접 알려주신 정보",
        "홈페이지 이용 과정에서 자동 수집될 수 있는 정보: 접속 IP, 브라우저 종류, 접속 일시 (호스팅 서버의 보안 로그)",
      ],
    },
    {
      title: "2. 개인정보의 이용 목적",
      body: [
        "레슨·촬영 예약 접수, 일정 확인 및 확정 연락",
        "레슨·촬영 진행, 사진·영상 및 인화물·액자 전달",
        "결제 안내, 환불·일정 변경 처리",
        "고객 문의 응대 및 불만 처리",
      ],
    },
    {
      title: "3. 보유 및 이용 기간",
      body: [
        "원칙적으로 예약·서비스 제공이 끝나면 지체 없이 파기합니다.",
        "다만 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 아래 기록은 정해진 기간 동안 보관합니다.",
        "· 계약 또는 청약철회 등에 관한 기록: 5년",
        "· 대금결제 및 재화 등의 공급에 관한 기록: 5년",
        "· 소비자의 불만 또는 분쟁처리에 관한 기록: 3년",
        "· 웹사이트 방문 기록(접속 로그): 3개월 (「통신비밀보호법」)",
      ],
    },
    {
      title: "4. 개인정보의 제3자 제공",
      body: [
        "지노스키는 고객님의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 근거가 있거나 수사기관이 적법한 절차에 따라 요청하는 경우는 예외로 합니다.",
      ],
    },
    {
      title: "5. 개인정보 처리의 위탁 및 국외 이전",
      body: [
        "원활한 예약 접수를 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.",
        "· Cloudflare, Inc. (미국): 예약 신청 내용을 대표자 카카오톡으로 전달하는 알림 서버 운영. 이전 항목: 이름, 휴대전화번호, 예약 내용 / 이전 방법: 신청 시 네트워크를 통한 전송 / 보관하지 않고 전달 즉시 처리",
        "· ㈜카카오: 예약 알림 메시지 발송(대표자 본인 카카오톡), 카카오톡 채널 상담",
        "· GitHub, Inc. (미국): 홈페이지 호스팅 (접속 로그)",
        "· 통신사: 고객님이 문자(SMS)로 신청하시는 경우 메시지 전송",
        "국외 이전을 원하지 않으시면 홈페이지 신청 대신 전화(010-4047-7711)로 예약하실 수 있습니다.",
      ],
    },
    {
      title: "6. 개인정보의 파기 절차 및 방법",
      body: [
        "보유 기간이 끝나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.",
        "전자 파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.",
      ],
    },
    {
      title: "7. 정보주체의 권리와 행사 방법",
      body: [
        "고객님은 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.",
        "아래 개인정보 보호책임자에게 전화, 이메일, 카카오톡 채널로 요청하시면 지체 없이 조치하겠습니다.",
        "만 14세 미만 아동의 예약은 법정대리인(보호자)이 신청해 주세요.",
      ],
    },
    {
      title: "8. 쿠키 및 브라우저 저장소",
      body: [
        "홈페이지는 광고·추적용 쿠키를 사용하지 않습니다.",
        "'오늘 하루 보지 않기' 같은 화면 설정만 고객님 브라우저(로컬 저장소)에 저장되며, 브라우저 설정에서 언제든 지울 수 있습니다.",
        "유튜브 영상은 재생 버튼을 누를 때에만 유튜브(개인정보 강화 모드)에서 불러옵니다.",
      ],
    },
    {
      title: "9. 개인정보의 안전성 확보 조치",
      body: [
        "개인정보는 대표자만 확인할 수 있도록 관리하며, 홈페이지 서버에 예약 정보를 따로 저장하지 않습니다.",
        "모든 통신은 암호화(HTTPS)되어 전송됩니다.",
      ],
    },
    {
      title: "10. 개인정보 보호책임자",
      body: [
        "성명: 박진호 (대표)",
        "연락처: 010-4047-7711 · wlsgh5743668@naver.com",
        "개인정보 침해에 대한 신고·상담은 아래 기관에도 문의하실 수 있습니다.",
        "· 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)",
        "· 개인정보분쟁조정위원회 (www.kopico.go.kr / 1833-6972)",
        "· 대검찰청 사이버범죄수사단 (www.spo.go.kr / 1301)",
        "· 경찰청 사이버수사국 (ecrm.police.go.kr / 국번없이 182)",
      ],
    },
    {
      title: "11. 방침의 변경",
      body: ["이 개인정보처리방침이 바뀌는 경우 시행 7일 전부터 홈페이지를 통해 알려드립니다."],
    },
  ],
  footerLink: "개인정보처리방침",
  formNotice: "신청하시면 예약 진행을 위해 이름·연락처 등을 수집·이용하는 데 동의하는 것으로 봅니다.",
};

const en: PrivacyContent = {
  title: "Privacy Policy",
  intro:
    "Jino Company ('JinoSki') protects your personal information in accordance with the Korean Personal Information Protection Act. This English version is provided for convenience; the Korean version prevails.",
  effectiveDate: "Effective: October 4, 2026",
  sections: [
    { title: "1. Information we collect", body: ["Lesson / photo-session requests: name, mobile number, preferred date and time, program or package, options, delivery method, requests (plus sport, level and age group for lessons).", "If you choose courier delivery: recipient name, address and phone (requested after confirmation).", "Server security logs: IP address, browser type, access time."] },
    { title: "2. Purpose of use", body: ["Handling and confirming bookings, running lessons and shoots, delivering photos, prints and frames, payment / refund / rescheduling guidance, and customer support."] },
    { title: "3. Retention", body: ["Deleted without delay once the service is complete, except records kept as required by Korean e-commerce law: contract and payment records 5 years, complaint records 3 years, access logs 3 months."] },
    { title: "4. Sharing with third parties", body: ["We do not provide your information to third parties except where required by law."] },
    { title: "5. Processors and overseas transfer", body: ["Cloudflare, Inc. (USA): relays booking requests to the owner's KakaoTalk without storing them.", "Kakao Corp.: booking notifications and KakaoTalk channel chat.", "GitHub, Inc. (USA): website hosting (access logs).", "If you do not want overseas transfer, please book by phone (+82-10-4047-7711)."] },
    { title: "6. Your rights", body: ["You may request access, correction, deletion or suspension of processing at any time via the contact below. Bookings for children under 14 should be made by a parent or guardian."] },
    { title: "7. Cookies", body: ["We use no advertising or tracking cookies. Only display settings (e.g. 'don't show today') are stored in your browser. YouTube videos load only when you press play (privacy-enhanced mode)."] },
    { title: "8. Privacy officer", body: ["Jinho Park (Owner) · +82-10-4047-7711 · wlsgh5743668@naver.com"] },
  ],
  footerLink: "Privacy Policy",
  formNotice: "By submitting, you agree to the collection and use of your name and phone number to process your booking.",
};

const zh: PrivacyContent = {
  title: "隐私政策",
  intro: "Jino Company（JinoSki）依据韩国《个人信息保护法》保护您的个人信息。本中文版本仅供参考，以韩文版本为准。",
  effectiveDate: "施行日期：2026年10月4日",
  sections: [
    { title: "1. 收集的信息", body: ["课程/拍摄预约：姓名、手机号码、希望日期与时段、项目或套餐、选项、领取方式、需求（课程另含项目、水平、年龄段）。", "选择快递时：收件人姓名、地址、电话（确认后另行收集）。", "服务器安全日志：IP地址、浏览器类型、访问时间。"] },
    { title: "2. 使用目的", body: ["受理及确认预约、进行课程与拍摄、交付照片与装裱作品、付款/退款/改期说明及客户咨询。"] },
    { title: "3. 保存期限", body: ["服务结束后立即销毁；但依韩国电子商务法保存：合同及付款记录5年，投诉记录3年，访问日志3个月。"] },
    { title: "4. 向第三方提供", body: ["除法律规定外，不向第三方提供您的个人信息。"] },
    { title: "5. 委托处理及境外转移", body: ["Cloudflare, Inc.（美国）：将预约内容转发至负责人KakaoTalk，不作保存。", "Kakao Corp.：预约通知及KakaoTalk频道咨询。", "GitHub, Inc.（美国）：网站托管（访问日志）。", "如不希望境外转移，请电话预约（+82-10-4047-7711）。"] },
    { title: "6. 您的权利", body: ["您可随时通过以下联系方式要求查阅、更正、删除或停止处理。未满14岁儿童请由监护人预约。"] },
    { title: "7. Cookie", body: ["不使用广告或追踪Cookie，仅在浏览器中保存显示设置。YouTube视频仅在点击播放时加载（隐私增强模式）。"] },
    { title: "8. 个人信息保护负责人", body: ["朴镇浩（代表）· +82-10-4047-7711 · wlsgh5743668@naver.com"] },
  ],
  footerLink: "隐私政策",
  formNotice: "提交即表示同意为处理预约而收集和使用您的姓名与电话。",
};

const map: Record<string, PrivacyContent> = { ko, en, zh };
export function getPrivacy(locale: string): PrivacyContent {
  return map[locale] ?? ko;
}
