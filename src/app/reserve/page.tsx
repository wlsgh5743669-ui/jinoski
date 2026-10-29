"use client";

import { useEffect } from "react";

// 블로그·SNS·톡톡 문구에 쓰는 짧은 예약 주소(jinoski.com/reserve)를 실제 예약 페이지(/ko/reserve/)로 넘겨요.
export default function ReserveRedirectPage() {
  useEffect(() => {
    // 유입 꼬리표(?utm_source=...)가 사라지지 않게 그대로 넘겨요
    window.location.replace("/ko/reserve/" + window.location.search + window.location.hash);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content="2;url=/ko/reserve/" />
      <p style={{ padding: 40, textAlign: "center" }}>
        Redirecting to{" "}
        <a href="/ko/reserve/" style={{ textDecoration: "underline" }}>
          jinoski.com/ko/reserve/
        </a>
        ...
      </p>
    </>
  );
}
