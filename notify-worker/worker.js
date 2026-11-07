/**
 * JinoSki 예약 알림 워커 (Cloudflare Workers, 무료 플랜으로 충분)
 *
 * 고객이 홈페이지에서 예약을 제출하면, 사장님 카카오톡의 "나와의 채팅"으로
 * 이름·고객번호·날짜·프로그램·금액을 바로 보내줍니다.
 *
 *   POST /                → 예약 알림 전송 (홈페이지가 호출) · 견적서 사진이 오면 사진 카드 + 글
 *   GET  /img/<id>.jpg    → 견적서 사진 (카톡 사진 카드용, KV에 90일 보관)
 *   POST /notify          → 통합 상담 수신함(inbox.jinoski.com) 알림 → 카톡 「나와의 채팅」. body.inquiry가 있으면 문의 목록(q:)에 「채팅 상담」으로도 저장
 *   GET  /inquiries       → 홈페이지 문의 목록 (운영 프로그램용, Authorization: Bearer QUOTES_KEY)
 *   POST /inquiries/update → 문의 상태·메모·답변 변경 (운영 프로그램용)
 *   GET/POST /blocklist   → 🚫 차단 번호·IP (운영 프로그램용) — 차단된 번호·IP의 문의는 보관만 하고 카톡 알림을 안 보냄 (손님 화면은 똑같이 「접수됨」)
 *   POST /my-quotes       → 손님이 휴대폰 번호 + 비밀번호로 내 견적·사장님 답변 확인
 *   GET  /setup?key=...   → 최초 1회: 카카오 로그인 → 토큰 저장
 *   GET  /callback        → 카카오 로그인 리다이렉트 처리
 *   GET  /test?key=...    → 테스트 메시지 전송
 *   (cron)                → 매주 토큰 갱신 (만료 방지)
 *
 * 필요한 설정 (README.md 참고):
 *   KV 바인딩: TOKENS
 *   Secrets:   KAKAO_REST_KEY, SETUP_KEY, (선택) KAKAO_CLIENT_SECRET, (선택) QUOTES_KEY — 운영 프로그램 연동 비밀키
 *   Vars:      ALLOWED_ORIGINS (예: "https://jinoski.com,http://localhost:3000")
 */

const KAUTH = "https://kauth.kakao.com";
const KAPI = "https://kapi.kakao.com";
const SITE_URL = "https://jinoski.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    try {
      if (request.method === "POST" && url.pathname === "/") {
        if (!cors["Access-Control-Allow-Origin"]) return text("forbidden origin", 403);
        const data = JSON.parse(await request.text());
        if (!data || !data.name || !data.phone) return text("missing fields", 400, cors);
        // 🚫 차단한 번호·IP(경쟁사 가짜 문의 등)면 보관만 하고 알림은 안 보냄 — 응답은 똑같이 "ok" (막힌 걸 모르게)
        const ip = (request.headers.get("cf-connecting-ip") || "").slice(0, 45);
        const blocked = blockedBy(await loadBlocklist(env), phoneKey(data.phone), ip);
        // 견적 계산기는 손님이 만든 견적 링크(link)를 같이 보내요 → 카톡 「견적 보기」 버튼으로 바로 열기
        const link = typeof data.link === "string" && /^https:\/\/(www\.)?jinoski\.com\//.test(data.link) ? data.link : "";
        // 견적서 사진(data:image/jpeg;base64,...)이 있으면 KV에 저장 → 사진 카드로 먼저 보내요
        let imageId = "";
        const m = typeof data.image === "string" && data.image.match(/^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/);
        if (m && m[2].length < 2_500_000) {
          try {
            const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
            const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
            await env.TOKENS.put(`img:${id}`, bytes, { expirationTtl: 60 * 60 * 24 * 90, metadata: { type: `image/${m[1]}` } });
            imageId = id;
            if (!blocked) await sendImageCard(env, data, `${url.origin}/img/${id}.jpg`, link, `${SITE_URL}/ko/quote/photo/?id=${id}`);
          } catch (e) {
            console.error("image card failed", e);
          }
        }
        // 운영 프로그램(ops.jinoski.com)에서 볼 수 있게 문의 내용도 보관 (실패해도 알림은 계속)
        try {
          await saveInquiry(env, data, imageId, link, { ip, blocked });
        } catch (e) {
          console.error("save inquiry failed", e);
        }
        if (!blocked) await sendMemo(env, formatBooking(data), link);
        return text("ok", 200, cors);
      }

      // ── 통합 상담 수신함(inbox.jinoski.com)용: 대표 확인이 필요한 문의를 카톡 「나와의 채팅」으로 알림 ──
      // NOTIFY_KEY 변수가 있으면 Authorization: Bearer NOTIFY_KEY 로 확인, 없으면 POST / 와 같이 허용된 Origin(inbox.jinoski.com)만 받음.
      // body.inquiry(수신함 0.1.11+)가 있으면 운영 프로그램 「견적 문의」에 「채팅 상담」 한 줄로 저장(같은 대화는 한 건을 갱신).
      if (request.method === "POST" && url.pathname === "/notify") {
        const authed = env.NOTIFY_KEY
          ? request.headers.get("Authorization") === `Bearer ${env.NOTIFY_KEY}`
          : !!cors["Access-Control-Allow-Origin"];
        if (!authed) return text("forbidden", 403);
        const b = await request.json().catch(() => ({}));
        const msg = typeof b.text === "string" ? b.text.trim().slice(0, 1200) : "";
        if (!msg) return text("missing text", 400);
        const link = typeof b.link === "string" && /^https:\/\/inbox\.jinoski\.com\//.test(b.link) ? b.link : "";
        if (b.inquiry && typeof b.inquiry === "object") {
          try {
            await upsertChatInquiry(env, b.inquiry, link);
          } catch (e) {
            console.error("chat inquiry failed", e);
          }
        }
        try {
          await sendMemo(env, msg, link, "수신함 열기");
        } catch (e) {
          // 카카오 앱에 inbox.jinoski.com 도메인이 등록돼 있지 않으면 링크 버튼이 거부될 수 있음 → 주소를 글에 넣어 다시 보냄
          console.error("notify with link failed", e);
          await sendMemo(env, link ? `${msg}\n${link}` : msg);
        }
        return text("ok");
      }

      // ── 운영 프로그램용: 문의 목록 / 상태 변경 ──
      if (url.pathname === "/inquiries" || url.pathname === "/inquiries/update" || url.pathname === "/blocklist") {
        if (!env.QUOTES_KEY || request.headers.get("Authorization") !== `Bearer ${env.QUOTES_KEY}`) return text("forbidden", 403, cors);
        const jsonRes = (o) => new Response(JSON.stringify(o), { headers: { "Content-Type": "application/json; charset=utf-8", ...cors } });
        if (url.pathname === "/blocklist") {
          if (request.method === "GET") return jsonRes(await loadBlocklist(env));
          if (request.method !== "POST") return text("method not allowed", 405, cors);
          const b = await request.json();
          const bl = await loadBlocklist(env);
          const phone = typeof b.phone === "string" ? phoneKey(b.phone) : "";
          const ipv = typeof b.ip === "string" ? b.ip.trim().slice(0, 45) : "";
          if (!phone && !ipv) return text("phone or ip required", 400, cors);
          if (ipv && !/^[0-9a-fA-F:.*]{3,45}$/.test(ipv)) return text("bad ip", 400, cors);
          const memo = typeof b.memo === "string" ? b.memo.slice(0, 60) : "";
          const at = new Date().toISOString();
          if (b.op === "add") {
            if (phone) bl.phones[phone] = { memo, at };
            if (ipv) bl.ips[ipv] = { memo, at };
          } else if (b.op === "remove") {
            if (phone) delete bl.phones[phone];
            if (ipv) delete bl.ips[ipv];
          } else return text("bad op", 400, cors);
          await env.TOKENS.put("blocklist", JSON.stringify(bl));
          return jsonRes(bl);
        }
        if (request.method === "GET" && url.pathname === "/inquiries") {
          const list = await env.TOKENS.list({ prefix: "q:", limit: 300 });
          const items = (await Promise.all(list.keys.map((k) => env.TOKENS.get(k.name, "json"))))
            .filter(Boolean)
            .map(({ pwHash, ...r }) => ({ ...r, hasPw: !!pwHash }));
          return jsonRes({ origin: url.origin, items });
        }
        if (request.method === "POST" && url.pathname === "/inquiries/update") {
          const b = await request.json();
          if (typeof b.key !== "string" || !b.key.startsWith("q:")) return text("bad key", 400, cors);
          const rec = await env.TOKENS.get(b.key, "json");
          if (!rec) return text("not found", 404, cors);
          if (["new", "contacted", "booked", "closed"].includes(b.status)) rec.status = b.status;
          if (typeof b.blocked === "string") rec.blocked = b.blocked.slice(0, 20); // "" = 차단 풀기, "manual" = 운영 프로그램에서 차단
          if (typeof b.memo === "string") rec.memo = b.memo.slice(-4000);
          // 손님에게 보이는 답변 (내 견적 확인 화면)
          if (typeof b.reply === "string") {
            rec.reply = b.reply.slice(0, 2000);
            rec.replyAt = rec.reply ? new Date().toISOString() : "";
          }
          rec.updatedAt = new Date().toISOString();
          await env.TOKENS.put(b.key, JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 365 });
          const { pwHash, ...out } = rec;
          return jsonRes({ ...out, hasPw: !!pwHash });
        }
        return text("method not allowed", 405, cors);
      }

      const im = request.method === "GET" && url.pathname.match(/^\/img\/([a-f0-9]{16})\.jpg$/);
      if (im) {
        const { value, metadata } = await env.TOKENS.getWithMetadata(`img:${im[1]}`, "arrayBuffer");
        if (!value) return text("not found", 404);
        return new Response(value, {
          headers: { "Content-Type": metadata?.type || "image/jpeg", "Cache-Control": "public, max-age=86400" },
        });
      }

      // ── 손님용: 휴대폰 번호 + 비밀번호로 내 견적과 답변 보기 ──
      if (request.method === "POST" && url.pathname === "/my-quotes") {
        if (!cors["Access-Control-Allow-Origin"]) return text("forbidden origin", 403);
        const b = await request.json().catch(() => ({}));
        const phone = String(b.phone || "").replace(/\D/g, "");
        const pw = String(b.pw || "");
        if (phone.length < 9 || pw.length < 4) return text("bad request", 400, cors);
        // 비밀번호 대입 방지: 같은 번호로 1시간에 10번까지
        const rlKey = `rl:${phone}`;
        const tries = Number((await env.TOKENS.get(rlKey)) || 0);
        if (tries >= 10) return text("too many", 429, cors);
        const list = await env.TOKENS.list({ prefix: "q:", limit: 300 });
        const all = (await Promise.all(list.keys.map((k) => env.TOKENS.get(k.name, "json")))).filter(Boolean);
        const mine = [];
        for (const r of all) {
          if (r.phoneDigits !== phone || !r.pwHash) continue;
          if ((await hashPw(r.id, pw)) === r.pwHash) mine.push(publicView(r, url.origin));
        }
        if (!mine.length) {
          await env.TOKENS.put(rlKey, String(tries + 1), { expirationTtl: 3600 });
          return text("not found", 404, cors);
        }
        return new Response(JSON.stringify({ items: mine }), { headers: { "Content-Type": "application/json; charset=utf-8", ...cors } });
      }

      if (url.pathname === "/setup") {
        if (url.searchParams.get("key") !== env.SETUP_KEY) return text("forbidden", 403);
        const auth = new URL(`${KAUTH}/oauth/authorize`);
        auth.searchParams.set("client_id", env.KAKAO_REST_KEY);
        auth.searchParams.set("redirect_uri", `${url.origin}/callback`);
        auth.searchParams.set("response_type", "code");
        auth.searchParams.set("scope", "talk_message");
        auth.searchParams.set("state", env.SETUP_KEY);
        return Response.redirect(auth.toString(), 302);
      }

      if (url.pathname === "/callback") {
        if (url.searchParams.get("state") !== env.SETUP_KEY) return text("forbidden", 403);
        const code = url.searchParams.get("code");
        if (!code) return text("no code: " + (url.searchParams.get("error_description") || ""), 400);
        const tok = await tokenRequest(env, {
          grant_type: "authorization_code",
          redirect_uri: `${url.origin}/callback`,
          code,
        });
        await saveTokens(env, tok);
        await sendMemo(env, "✅ 지노스키 예약 알림이 연결되었습니다.\n이제 홈페이지 예약이 들어오면 여기로 알려드려요.");
        return html("<h2>연결 완료!</h2><p>카카오톡 '나와의 채팅'에 테스트 메시지를 보냈어요. 이 창은 닫으셔도 됩니다.</p>");
      }

      if (url.pathname === "/test") {
        if (url.searchParams.get("key") !== env.SETUP_KEY) return text("forbidden", 403);
        await sendMemo(env, formatBooking({
          name: "테스트", phone: "010-0000-0000", date: "2026-12-03",
          program: "3시간 레슨", timeSlot: "오후 타임 (13:20 ~ 16:20)", groupSize: "1:3",
          equipment: "스노보드", level: "중급", total: "395,000원", note: "테스트 메시지",
        }));
        return text("sent");
      }

      return text("JinoSki notify worker", 200, cors);
    } catch (err) {
      console.error(err);
      return text("error: " + err.message, 500, cors);
    }
  },

  // 매주 토큰을 갱신해서 리프레시 토큰(약 2개월)이 만료되지 않게 유지
  async scheduled(_event, env) {
    await getAccessToken(env, true);
  },
};

// 홈페이지 문의 보관: 최신순 정렬되게 키 앞에 (큰 수 - 시각)
// 손님 비밀번호는 그대로 저장하지 않고 문의 id를 섞어 해시로만 보관
async function hashPw(salt, pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${pw}`));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// 손님에게 보여줄 항목만 (사장님 메모·전화번호 등은 빼고)
function publicView(r, origin) {
  return {
    id: r.id,
    createdAt: r.createdAt,
    kind: r.kind,
    name: r.name,
    date: r.date,
    groupSize: r.groupSize,
    timeSlot: r.timeSlot,
    total: r.total,
    headline: r.headline,
    request: r.request,
    link: r.link,
    image: r.image ? `${origin}${r.image}` : "",
    status: r.status,
    reply: r.reply || "",
    replyAt: r.replyAt || "",
  };
}

/** 금액표는 모양만 확인해서 저장 (너무 크면 버림) */
function cleanBreakdown(b) {
  if (!b || typeof b !== "object" || !Array.isArray(b.days) || !Array.isArray(b.persons)) return null;
  const json = JSON.stringify(b);
  return json.length <= 30000 ? JSON.parse(json) : null;
}

async function saveInquiry(env, d, imageId, link, extra = {}) {
  const cut = (v, n = 300) => (typeof v === "string" ? v.slice(0, n) : "");
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const key = `q:${String(9_000_000_000_000 - Date.now()).padStart(13, "0")}:${id}`;
  const rec = {
    key,
    id,
    createdAt: new Date().toISOString(),
    kind: d.kind === "견적" || d.kind === "견적 수정" ? d.kind : "예약",
    name: cut(d.name, 40),
    phone: cut(d.phone, 30),
    date: cut(d.date, 120),
    program: cut(d.program, 120),
    timeSlot: cut(d.timeSlot, 300),
    groupSize: cut(d.groupSize, 120),
    equipment: cut(d.equipment, 120),
    level: cut(d.level, 60),
    total: cut(d.total, 80),
    headline: cut(d.headline, 120),
    request: cut(d.request, 500),
    note: cut(d.note, 1000),
    link: link || "",
    image: imageId ? `/img/${imageId}.jpg` : "",
    status: "new",
    memo: "",
    reply: "",
    phoneDigits: cut(d.phone, 30).replace(/\D/g, ""),
    pwHash: "",
    // 날짜별·사람별 금액표 (홈페이지 견적 계산기) — 운영 프로그램 견적서가 같은 숫자로 보여줘요
    breakdown: cleanBreakdown(d.breakdown),
    // 🚫 접속 IP(차단용) · 차단된 번호/IP로 들어와 알림 안 보낸 문의면 blocked = "phone" | "ip"
    ip: extra.ip || "",
    blocked: extra.blocked || "",
  };
  const pw = typeof d.pw === "string" ? d.pw.trim().slice(0, 20) : "";
  if (pw.length >= 4) rec.pwHash = await hashPw(id, pw);
  await env.TOKENS.put(key, JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 365 });
}

// 통합 상담 수신함의 대화 → 운영 프로그램 「견적 문의」 목록에 「채팅 상담」으로.
// 같은 대화(convId)는 inbox:<convId> → q:키 매핑으로 한 건을 계속 갱신 (대화 내용은 note 위에 쌓임).
const CHAT_KIND = "채팅 상담";
async function upsertChatInquiry(env, q, link) {
  const cut = (v, n = 300) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  const convId = cut(q.convId, 40).replace(/[^0-9A-Za-z_-]/g, "");
  if (!convId) return;
  const ttl = { expirationTtl: 60 * 60 * 24 * 365 };
  const mapKey = `inbox:${convId}`;
  const now = new Date().toISOString();
  const stamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const lines = [
    `[${stamp}] ${cut(q.category, 20)}${q.handoff ? ` · 확인 필요: ${cut(q.handoff, 200)}` : ""}`,
    `손님: ${cut(q.customer, 500)}`,
    q.reply ? `${cut(q.replyLabel, 20) || "답"}: ${cut(q.reply, 500)}` : "",
  ].filter(Boolean);
  const noteLine = lines.join("\n");
  const existingKey = await env.TOKENS.get(mapKey);
  if (existingKey) {
    const rec = await env.TOKENS.get(existingKey, "json");
    if (rec) {
      rec.updatedAt = now;
      rec.request = cut(q.customer, 500);
      rec.headline = cut(q.headline, 120) || rec.headline;
      rec.note = `${noteLine}\n\n${rec.note || ""}`.slice(0, 4000);
      if (rec.status === "closed") rec.status = "new"; // 끝난 손님이 다시 말하면 새 문의로
      await env.TOKENS.put(existingKey, JSON.stringify(rec), ttl);
      return;
    }
  }
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const key = `q:${String(9_000_000_000_000 - Date.now()).padStart(13, "0")}:${id}`;
  const rec = {
    key, id, createdAt: now, kind: CHAT_KIND,
    name: cut(q.name, 40) || "손님", phone: cut(q.phone, 30),
    date: "", program: cut(q.channel, 40), timeSlot: "", groupSize: "", equipment: "", level: "", total: "",
    headline: cut(q.headline, 120), request: cut(q.customer, 500), note: noteLine.slice(0, 4000),
    link: link || "", image: "", status: "new", memo: "", reply: "",
    phoneDigits: cut(q.phone, 30).replace(/\D/g, ""), pwHash: "",
  };
  await env.TOKENS.put(key, JSON.stringify(rec), ttl);
  await env.TOKENS.put(mapKey, key, ttl);
}

// 카카오 "나에게 보내기" 텍스트는 최대 200자
function formatBooking(d) {
  // 견적 계산기 알림은 짧게 — 전체 내용은 「견적 보기」 버튼(손님이 만든 견적 화면 그대로)으로 확인
  if (d.kind === "견적" || d.kind === "견적 수정") {
    const q = [
      `[지노스키 ${d.kind}] ${d.name}`,
      `📞 ${d.phone}`,
      `📅 ${d.date}`,
      `👥 ${d.groupSize}`,
      `💰 ${d.total}`,
      d.request ? `📝 ${d.request}` : "",
      "👇 견적 보기에서 일정·리프트·개인별 금액 전체 확인",
    ].filter(Boolean);
    const qm = q.join("\n");
    return qm.slice(0, 1200);
  }
  const lines = [
    `[지노스키 ${d.kind === "견적" || d.kind === "견적 수정" ? d.kind : "예약"}] ${d.name}`,
    `📞 ${d.phone}`,
    `📅 ${d.date} ${d.timeSlot || ""}`.trim(),
    `🎿 ${d.program} · ${d.groupSize}`,
    [d.equipment, d.level].filter(Boolean).join(" · "),
    `💰 ${d.total}`,
    d.note ? `📝 ${d.note}` : "",
  ].filter(Boolean);
  const msg = lines.join("\n");
  return msg.slice(0, 1200);
}

// 사진 카드 (피드 템플릿): 견적서 사진 + 이름·연락처·요약 + 「견적 보기」「사진 크게 보기」
async function sendImageCard(env, d, imageUrl, link, photoPage) {
  const page = link || SITE_URL;
  const kind = d.kind === "견적" || d.kind === "견적 수정" ? d.kind : "예약";
  const content = {
    title: `[지노스키 ${kind}] ${d.name} · ${d.phone}`.slice(0, 80),
    description: [d.date, d.groupSize, d.headline || d.total].filter(Boolean).join("\n").slice(0, 200),
    image_url: imageUrl,
    image_width: Number(d.imageW) || 1080,
    image_height: Number(d.imageH) || 1350,
    link: { web_url: page, mobile_web_url: page },
  };
  const tries = [
    // 사진 크게 보기는 jinoski.com 안의 사진 화면으로 열어요 (카카오에 등록된 도메인이라 그대로 열림)
    [
      { title: "견적 보기", link: { web_url: page, mobile_web_url: page } },
      { title: "사진 크게 보기", link: { web_url: photoPage, mobile_web_url: photoPage } },
    ],
    [{ title: "견적 보기", link: { web_url: page, mobile_web_url: page } }],
  ];
  let last;
  for (const buttons of tries) {
    try {
      return await sendTemplate(env, { object_type: "feed", content, buttons });
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

async function sendTemplate(env, template) {
  const accessToken = await getAccessToken(env);
  const res = await fetch(`${KAPI}/v2/api/talk/memo/default/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({ template_object: JSON.stringify(template) }),
  });
  if (!res.ok) throw new Error(`kakao send ${res.status}: ${await res.text()}`);
}

// 카톡 「나에게 보내기」 글은 1통에 200자까지 → 길면 (1/2) (2/2)처럼 나눠서 전부 보내요
function splitMessage(message, max = 190) {
  const parts = [];
  let cur = "";
  for (const line of message.split("\n")) {
    let rest = line;
    while (rest.length > max) {
      if (cur) {
        parts.push(cur);
        cur = "";
      }
      parts.push(rest.slice(0, max));
      rest = rest.slice(max);
    }
    const next = cur ? `${cur}\n${rest}` : rest;
    if (next.length > max) {
      parts.push(cur);
      cur = rest;
    } else cur = next;
  }
  if (cur) parts.push(cur);
  return parts.slice(0, 6);
}

async function sendMemo(env, message, link = "", buttonTitle = "") {
  // 견적은 「견적 보기」(손님 견적 화면), 예약 문의는 「문의함 보기」(jinoski.com 문의함), 수신함 알림은 「수신함 열기」
  const url = link || `${SITE_URL}/ko/quote/inbox/`;
  const parts = splitMessage(message);
  for (let i = 0; i < parts.length; i++) {
    const text = parts.length > 1 ? `${parts[i]}\n(${i + 1}/${parts.length})` : parts[i];
    await sendTemplate(env, {
      object_type: "text",
      text,
      link: { web_url: url, mobile_web_url: url },
      button_title: buttonTitle || (link ? "견적 보기" : "문의함 보기"),
    });
  }
}

async function getAccessToken(env, forceRefresh = false) {
  const stored = await env.TOKENS.get("tokens", "json");
  if (!stored?.refresh_token) throw new Error("not set up — open /setup?key=... first");
  if (!forceRefresh && stored.access_token && stored.expires_at > Date.now() + 60_000) {
    return stored.access_token;
  }
  const tok = await tokenRequest(env, {
    grant_type: "refresh_token",
    refresh_token: stored.refresh_token,
  });
  // 카카오는 리프레시 토큰 만료 1개월 전부터만 새 리프레시 토큰을 줌 → 없으면 기존 유지
  await saveTokens(env, { ...tok, refresh_token: tok.refresh_token || stored.refresh_token });
  return tok.access_token;
}

async function tokenRequest(env, params) {
  const body = new URLSearchParams({ client_id: env.KAKAO_REST_KEY, ...params });
  if (env.KAKAO_CLIENT_SECRET) body.set("client_secret", env.KAKAO_CLIENT_SECRET);
  const res = await fetch(`${KAUTH}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
  });
  if (!res.ok) throw new Error(`kakao token ${res.status}: ${await res.text()}`);
  return res.json();
}

async function saveTokens(env, tok) {
  await env.TOKENS.put(
    "tokens",
    JSON.stringify({
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      expires_at: Date.now() + (tok.expires_in || 0) * 1000,
    })
  );
}

// ── 🚫 차단 목록 (KV "blocklist") ── { phones: { "01012345678": {memo, at} }, ips: { "1.2.3.4" | "1.2.3.*": {memo, at} } }
async function loadBlocklist(env) {
  const v = await env.TOKENS.get("blocklist", "json").catch(() => null);
  return { phones: (v && v.phones) || {}, ips: (v && v.ips) || {} };
}
/** 번호 비교용: 숫자만 · +82 10… → 010… */
function phoneKey(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("82") && d.length >= 11) d = "0" + d.slice(2);
  return d.length >= 8 ? d.slice(0, 20) : "";
}
function blockedBy(bl, phone, ip) {
  if (phone && bl.phones[phone]) return "phone";
  if (ip) {
    if (bl.ips[ip]) return "ip";
    for (const k of Object.keys(bl.ips)) if (k.endsWith(".*") && ip.startsWith(k.slice(0, -1))) return "ip";
  }
  return "";
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "https://jinoski.com")
    .split(",").map((s) => s.trim());
  if (!allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function text(body, status = 200, headers = {}) {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", ...headers } });
}
function html(body) {
  return new Response(`<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;padding:32px">${body}`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
