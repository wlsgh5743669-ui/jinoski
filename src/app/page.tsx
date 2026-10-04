"use client";

import { useEffect } from "react";

export default function RootRedirectPage() {
  useEffect(() => {
    // 유입 꼬리표(?utm_source=...)가 사라지지 않게 그대로 넘겨요
    window.location.replace("/ko/" + window.location.search + window.location.hash);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content="2;url=/ko/" />
      <p style={{ padding: 40, textAlign: "center" }}>
        Redirecting to{" "}
        <a href="/ko/" style={{ textDecoration: "underline" }}>
          jinoski.com/ko/
        </a>
        ...
      </p>
    </>
  );
}
