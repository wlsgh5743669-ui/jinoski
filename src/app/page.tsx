"use client";

import { useEffect } from "react";

export default function RootRedirectPage() {
  useEffect(() => {
    window.location.replace("/ko/");
  }, []);

  return (
    <p style={{ padding: 40, textAlign: "center" }}>
      Redirecting to{" "}
      <a href="/ko/" style={{ textDecoration: "underline" }}>
        jinoski.com/ko/
      </a>
      ...
    </p>
  );
}
