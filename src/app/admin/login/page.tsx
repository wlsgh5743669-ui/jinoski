"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "로그인에 실패했습니다");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-[22px] font-bold tracking-tight text-ink-900">
        JINO<span className="text-brand-500">SKI</span> 관리자
      </h1>
      <p className="mt-2 text-[14px] text-snow-500">비밀번호를 입력하세요</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <input
          type="password"
          autoFocus
          placeholder="비밀번호"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="h-14 rounded-2xl border border-snow-300/60 bg-white px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
        />
        {error && <p className="text-[13.5px] text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || passcode.length === 0}
          className="h-14 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
