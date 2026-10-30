import { trQuote, type QLocale } from "@/lib/quote-i18n";
// 견적 결과를 PNG 이미지로 그려요 (손님이 저장해서 카톡으로 사진 전송용)

export type QuoteImageData = {
  title: string; // 2박 3일 · 2시간 · 하루 2회 · 수업 6회
  total: string;
  totalSub: string; // 2팀 6명 · 1인 평균 …
  grand?: string; // 총 합계 금액 (크게 · 파란 상자)
  grandLabel?: string;
  /** 1인당 금액 풀어보기: 사람마다 강습료(몇 시간) · 패찰 · 리프트 · 장비 · 헬멧 → 합계 */
  persons?: { label: string; sub: string; pay: number; rows: { k: string; d: string; v: number }[] }[];
  schedule: { left: string; right: string }[];
  teams: { name: string; amount: string; lines: string[] }[];
  notes: string[];
  phone: string;
};

const W = 1080;
const PAD = 72;
const NAVY = "#0E1A33";
const BLUE = "#2DA8FF";
const INK = "#0A0B0D";
const GRAY = "#6B7280";
const LINE = "#E5E7EB";
const GREEN = "#03A94F";
/** 💳 입금 계좌 (견적서 맨 아래 · 한국어 견적서에만) */
const BANK = { name: "국민은행", account: "01040477711", holder: "박진호(지노컴퍼니)" };

function font(size: number, weight = 500) {
  return `${weight} ${size}px "Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  // 띄어쓰기 단위로 줄바꿈 (한 단어가 너무 길 때만 글자 단위)
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= max) {
        line = next;
        continue;
      }
      if (line) out.push(line);
      line = "";
      for (const ch of word) {
        if (ctx.measureText(line + ch).width > max && line) {
          out.push(line);
          line = ch;
        } else line += ch;
      }
    }
    out.push(line);
  }
  return out;
}

export async function renderQuoteImage(
  d: QuoteImageData,
  type: "image/png" | "image/jpeg" = "image/png",
  loc: QLocale = "ko"
): Promise<Blob> {
  const tr = (s: string) => trQuote(s, loc);
  if (document.fonts?.ready) await document.fonts.ready;
  const inner = W - PAD * 2;
  // 1) 높이 계산용 그리기 함수 (dry=true면 위치만 계산)
  const draw = (ctx: CanvasRenderingContext2D, dry: boolean) => {
    let y = 0;
    // 헤더
    if (!dry) {
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, W, 230);
      ctx.fillStyle = "#fff";
      ctx.font = font(40, 800);
      ctx.fillText("JINO", PAD, 96);
      const w = ctx.measureText("JINO").width;
      ctx.fillStyle = BLUE;
      ctx.fillText("SKI", PAD + w, 96);
      // 제목과 오른쪽 안내가 겹치지 않게 제목 글자 크기를 줄여요 (영어·중국어)
      ctx.font = font(26, 500);
      const subW = ctx.measureText(tr("비발디파크 스키·보드 강습")).width;
      let ts = 54;
      for (; ts > 36; ts -= 2) {
        ctx.font = font(ts, 800);
        if (ctx.measureText(tr("가족·연박 견적서")).width + subW + 30 <= W - PAD * 2) break;
      }
      ctx.fillStyle = "#fff";
      ctx.fillText(tr("가족·연박 견적서"), PAD, 172);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = font(26, 500);
      const now = new Date();
      ctx.textAlign = "right";
      ctx.fillText(tr(`${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} 기준`), W - PAD, 96);
      ctx.fillText(tr("비발디파크 스키·보드 강습"), W - PAD, 172);
      ctx.textAlign = "left";
    }
    y = 230 + 70;

    // 요약
    ctx.font = font(30, 600);
    if (!dry) {
      ctx.fillStyle = GRAY;
      ctx.fillText(d.title, PAD, y);
    }
    y += 86;
    // 1인 금액 줄이 화면을 넘으면 글자를 줄여요
    for (let fs = 70; fs >= 40; fs -= 2) {
      ctx.font = font(fs, 800);
      if (ctx.measureText(d.total).width <= W - PAD * 2) break;
    }
    if (!dry) {
      ctx.fillStyle = INK;
      ctx.fillText(d.total, PAD, y);
    }
    y += 50;
    ctx.font = font(26, 500);
    if (!dry) {
      ctx.fillStyle = GRAY;
      ctx.fillText(d.totalSub, PAD, y);
    }
    y += 50;
    // 💙 총 합계: 한눈에 보이게 파란 상자 + 큰 글씨
    if (d.grand) {
      const top = y - 10, h = 112;
      if (!dry) {
        ctx.fillStyle = "#EAF5FF";
        if (typeof ctx.roundRect === "function") { ctx.beginPath(); ctx.roundRect(PAD, top, inner, h, 20); ctx.fill(); }
        else ctx.fillRect(PAD, top, inner, h);
        ctx.fillStyle = BLUE;
        ctx.fillRect(PAD, top + 18, 6, h - 36);
        ctx.fillStyle = NAVY;
        ctx.font = font(32, 800);
        ctx.fillText(d.grandLabel ?? "총 합계", PAD + 32, top + h / 2 + 12);
        let gs = 56;
        for (; gs >= 36; gs -= 2) {
          ctx.font = font(gs, 800);
          if (ctx.measureText(d.grand).width <= inner - 260) break;
        }
        ctx.fillStyle = "#0B6BCB";
        ctx.textAlign = "right";
        ctx.fillText(d.grand, W - PAD - 32, top + h / 2 + gs * 0.36);
        ctx.textAlign = "left";
      }
      y = top + h + 46;
    }

    const section = (title: string) => {
      if (!dry) {
        ctx.fillStyle = LINE;
        ctx.fillRect(PAD, y, inner, 2);
      }
      y += 60;
      ctx.font = font(28, 700);
      if (!dry) {
        ctx.fillStyle = BLUE;
        ctx.fillText(title, PAD, y);
      }
      y += 24;
    };

    section(tr("시간표"));
    for (const r of d.schedule) {
      y += 46;
      ctx.font = font(29, 600);
      if (!dry) {
        ctx.fillStyle = INK;
        ctx.fillText(r.left, PAD, y);
        ctx.textAlign = "right";
        ctx.font = font(29, 500);
        ctx.fillText(r.right, W - PAD, y);
        ctx.textAlign = "left";
      }
    }
    y += 34;

    // 💰 1인당 금액: 사람마다 카드 (항목 · 내용 · 금액 → 합계)
    if (d.persons?.length) {
      section(tr("1인당 금액"));
      const n = (v: number) => (v ? `${v.toLocaleString("ko-KR")}${tr("원")}` : tr("포함"));
      for (const p of d.persons) {
        y += 26;
        const top = y;
        const h = 92 + p.rows.length * 48 + 24;
        if (!dry) {
          ctx.fillStyle = "#F8FAFC";
          if (typeof ctx.roundRect === "function") { ctx.beginPath(); ctx.roundRect(PAD, top, inner, h, 18); ctx.fill(); }
          else ctx.fillRect(PAD, top, inner, h);
          // 머리: 이름 · 반/종목 ………… 합계
          ctx.fillStyle = INK;
          ctx.font = font(30, 800);
          ctx.fillText(p.label, PAD + 28, top + 56);
          const lw = ctx.measureText(p.label).width;
          ctx.fillStyle = GRAY;
          ctx.font = font(22, 500);
          ctx.fillText(p.sub, PAD + 28 + lw + 14, top + 56);
          ctx.textAlign = "right";
          ctx.fillStyle = "#0B6BCB";
          ctx.font = font(34, 800);
          ctx.fillText(n(p.pay), W - PAD - 28, top + 58);
          ctx.textAlign = "left";
          ctx.fillStyle = LINE;
          ctx.fillRect(PAD + 28, top + 82, inner - 56, 2);
          p.rows.forEach((r, i) => {
            const ry = top + 92 + i * 48 + 34;
            ctx.fillStyle = INK;
            ctx.font = font(25, 700);
            ctx.fillText(r.k, PAD + 28, ry);
            ctx.fillStyle = GRAY;
            ctx.font = font(22, 500);
            let dt = r.d;
            while (dt.length > 4 && ctx.measureText(dt).width > inner - 56 - 120 - 190) dt = dt.slice(0, -2) + "…";
            ctx.fillText(dt, PAD + 28 + 120, ry);
            ctx.textAlign = "right";
            ctx.fillStyle = r.v ? INK : GREEN;
            ctx.font = font(25, 700);
            ctx.fillText(n(r.v), W - PAD - 28, ry);
            ctx.textAlign = "left";
          });
        }
        y = top + h;
      }
      y += 40;
    }

    section(tr("금액 내역"));
    for (const t of d.teams) {
      y += 52;
      ctx.font = font(32, 700);
      if (!dry) {
        ctx.fillStyle = INK;
        ctx.fillText(t.name, PAD, y);
        ctx.textAlign = "right";
        ctx.fillText(t.amount, W - PAD, y);
        ctx.textAlign = "left";
      }
      ctx.font = font(25, 500);
      for (const l of t.lines) {
        for (const w of wrap(ctx, l, inner)) {
          y += 38;
          if (!dry) {
            ctx.fillStyle = l.includes("40%") ? GREEN : GRAY;
            ctx.fillText(w, PAD, y);
          }
        }
      }
      y += 10;
    }
    y += 30;

    // 안내
    if (!dry) {
      ctx.fillStyle = LINE;
      ctx.fillRect(PAD, y, inner, 2);
    }
    y += 20;
    ctx.font = font(23, 500);
    for (const n of d.notes) {
      for (const w of wrap(ctx, `· ${n}`, inner)) {
        y += 36;
        if (!dry) {
          ctx.fillStyle = GRAY;
          ctx.fillText(w, PAD, y);
        }
      }
    }
    y += 60;

    // 💳 맨 아래: 총 합계 + 입금 계좌
    if (d.grand) {
      const bank = loc === "ko";
      const h = bank ? 236 : 120;
      if (!dry) {
        ctx.fillStyle = "#F8FAFC";
        if (typeof ctx.roundRect === "function") { ctx.beginPath(); ctx.roundRect(PAD, y, inner, h, 20); ctx.fill(); }
        else ctx.fillRect(PAD, y, inner, h);
        ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 2;
        if (typeof ctx.roundRect === "function") { ctx.beginPath(); ctx.roundRect(PAD, y, inner, h, 20); ctx.stroke(); }
        ctx.fillStyle = NAVY;
        ctx.font = font(32, 800);
        ctx.fillText(d.grandLabel ?? tr("총 합계"), PAD + 36, y + 74);
        ctx.fillStyle = "#0B6BCB";
        ctx.font = font(48, 800);
        ctx.textAlign = "right";
        ctx.fillText(d.grand, W - PAD - 36, y + 80);
        ctx.textAlign = "left";
        if (bank) {
          ctx.fillStyle = LINE;
          ctx.fillRect(PAD + 36, y + 116, inner - 72, 2);
          ctx.fillStyle = GRAY;
          ctx.font = font(26, 600);
          ctx.fillText("입금 계좌", PAD + 36, y + 170);
          ctx.fillStyle = INK;
          ctx.font = font(34, 800);
          ctx.textAlign = "right";
          ctx.fillText(`${BANK.name} ${BANK.account}`, W - PAD - 36, y + 172);
          ctx.fillStyle = GRAY;
          ctx.font = font(26, 600);
          ctx.fillText(`예금주 ${BANK.holder}`, W - PAD - 36, y + 214);
          ctx.textAlign = "left";
        }
      }
      y += h + 56;
    }

    // 하단 연락처
    if (!dry) {
      ctx.fillStyle = "#F1F7FF";
      ctx.fillRect(0, y, W, 150);
      ctx.fillStyle = INK;
      ctx.font = font(30, 700);
      ctx.fillText(tr(`문의  ${d.phone}  ·  카카오톡 「지노스키」`), PAD, y + 66);
      ctx.fillStyle = GRAY;
      ctx.font = font(25, 500);
      ctx.fillText(tr(`jinoski.com/${loc}/quote  ·  이 이미지를 카톡으로 보내주시면 바로 확인해 드려요`), PAD, y + 112);
    }
    y += 150;
    return y;
  };

  const probe = document.createElement("canvas").getContext("2d")!;
  const height = Math.ceil(draw(probe, true));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, height);
  ctx.textBaseline = "alphabetic";
  draw(ctx, false);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), type, 0.85)
  );
}
