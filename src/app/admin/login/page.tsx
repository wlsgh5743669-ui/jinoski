"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = null;

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-ice-gradient px-5">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-3xl border border-snow-300/60 bg-white p-8"
      >
        <h1 className="text-[22px] font-bold text-ink-900">관리자 로그인</h1>
        <p className="mt-2 text-[14px] text-snow-500">
          JinoSki 예약 관리 페이지입니다.
        </p>

        <input
          type="password"
          name="passcode"
          placeholder="비밀번호"
          autoFocus
          className="mt-6 h-14 w-full rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
        />

        {state?.error && (
          <p className="mt-3 text-[13.5px] text-red-500">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 h-14 w-full rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {isPending ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
