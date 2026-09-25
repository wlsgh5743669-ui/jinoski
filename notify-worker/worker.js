/**
 * JinoSki 예약 알림 워커 (Cloudflare Workers, 무료 플랜으로 충분)
 *
 * 고객이 홈페이지에서 예약을 제출하면, 사장님 카카오톡의 "나와의 채팅"으로
 * 이름·고객번호·날짜·프로그램·금액을 바로 보내줍니다.
 *
 *   POST /                → 예약 알림 전송 (홈페이지가 호출)
 *   GET  /setup?key=...   → 최초 1회: 카카오 로그인 → 토큰 저장
 *   GET  /callback        → 카카오 로그인 리다이렉트 처리
 *   GET  /test?key=...    → 테스트 메시지 전송
 *   (cron)                → 매주 토큰 갱신 (만료 방지)
 *
 * 필요한 설정 (README.md 참고):
 *   KV 바인딩: TOKENS
 *   Secrets:   KAKAO_REST_KEY, SETUP_KEY, (선택) KAKAO_CLIENT_SECRET
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
        await sendMemo(env, formatBooking(data));
        return text("ok", 200, cors);
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

// 카카오 "나에게 보내기" 텍스트는 최대 200자
function formatBooking(d) {
  const lines = [
    `[지노스키 예약] ${d.name}`,
    `📞 ${d.phone}`,
    `📅 ${d.date} ${d.timeSlot || ""}`.trim(),
    `🎿 ${d.program} · ${d.groupSize}`,
    [d.equipment, d.level].filter(Boolean).join(" · "),
    `💰 ${d.total}`,
    d.note ? `📝 ${d.note}` : "",
  ].filter(Boolean);
  const msg = lines.join("\n");
  return msg.length > 200 ? msg.slice(0, 199) + "…" : msg;
}

async function sendMemo(env, message) {
  const accessToken = await getAccessToken(env);
  const template = {
    object_type: "text",
    text: message,
    link: { web_url: SITE_URL, mobile_web_url: SITE_URL },
    button_title: "홈페이지",
  };
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

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "https://jinoski.com")
    .split(",").map((s) => s.trim());
  if (!allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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
