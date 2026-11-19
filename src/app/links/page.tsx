"use client";

import { useEffect } from "react";

// 인스타 프로필에 넣는 짧은 주소(jinoski.com/links)를 링크 모음(/ko/links/)으로 넘겨요.
export default function LinksRedirectPage() {
  useEffect(() => {
    // 유입 꼬리표(?utm_source=instagram)가 사라지지 않게 그대로 넘겨요
    window.location.replace("/ko/links/" + window.location.search + window.location.hash);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content="2;url=/ko/links/" />
      <p style={{ padding: 40, textAlign: "center" }}>
        Redirecting to{" "}
        <a href="/ko/links/" style={{ textDecoration: "underline" }}>
          jinoski.com/ko/links/
        </a>
        ...
      </p>
    </>
  );
}
