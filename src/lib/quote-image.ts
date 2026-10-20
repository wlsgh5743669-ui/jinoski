// 견적 결과를 PNG 이미지로 그려요 (손님이 저장해서 카톡으로 사진 전송용)

export type QuoteImageData = {
  title: string; // 2박 3일 · 2시간 · 하루 2회 · 수업 6회
  total: string;
  totalSub: string; // 2팀 6명 · 1인 평균 …
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

export async function renderQuoteImage(d: QuoteImageData): Promise<Blob> {
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
      ctx.fillStyle = "#fff";
      ctx.font = font(54, 800);
      ctx.fillText("가족·연박 견적서", PAD, 172);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = font(26, 500);
      const now = new Date();
      ctx.textAlign = "right";
      ctx.fillText(`${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} 기준`, W - PAD, 96);
      ctx.fillText("비발디파크 스키·보드 강습", W - PAD, 172);
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
    ctx.font = font(84, 800);
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

    section("시간표");
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

    section("팀별 비용");
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

    // 하단 연락처
    if (!dry) {
      ctx.fillStyle = "#F1F7FF";
      ctx.fillRect(0, y, W, 150);
      ctx.fillStyle = INK;
      ctx.font = font(30, 700);
      ctx.fillText(`문의  ${d.phone}  ·  카카오톡 「지노스키」`, PAD, y + 66);
      ctx.fillStyle = GRAY;
      ctx.font = font(25, 500);
      ctx.fillText("jinoski.com/ko/quote  ·  이 이미지를 카톡으로 보내주시면 바로 확인해 드려요", PAD, y + 112);
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
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}
