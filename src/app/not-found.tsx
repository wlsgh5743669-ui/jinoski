"use client";

import { useEffect, useState } from "react";

const LOCALES = ["ko", "en", "zh"];

// 정적 배포(GitHub Pages)에서는 서버 리다이렉트를 쓸 수 없어서, 없는 주소는 이 404 페이지가 받아요.
// 언어 접두어가 빠진 주소(jinoski.com/pricing 등)는 /ko/ 아래 같은 주소로 넘겨요.
export default function NotFound() {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const first = path.split("/")[1] ?? "";
    if (path !== "/" && !LOCALES.includes(first)) {
      setRedirecting(true);
      const withSlash = path.endsWith("/") ? path : path + "/";
      window.location.replace("/ko" + withSlash + window.location.search + window.location.hash);
    }
  }, []);

  return (
    <main style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
      {redirecting ? (
        <p>Redirecting...</p>
      ) : (
        <>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>페이지를 찾을 수 없어요</h1>
          <p>
            <a href="/ko/" style={{ textDecoration: "underline" }}>
              jinoski.com 홈으로 가기
            </a>
          </p>
        </>
      )}
    </main>
  );
}
