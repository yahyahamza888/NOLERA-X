"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalLoginHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest(
        "a,button,[role='button'],[data-login]"
      ) as HTMLElement | null;

      if (!clickable) return;

      const text = (clickable.textContent || "").trim();

      const isLogin =
        clickable.hasAttribute("data-login") ||
        text === "تسجيل الدخول" ||
        text.includes("تسجيل الدخول") ||
        text.includes("يجب تسجيل الدخول") ||
        text.includes("سجل الدخول") ||
        text.includes("سجّل الدخول");

      if (!isLogin) return;

      event.preventDefault();
      event.stopPropagation();

      router.push("/login");
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [router]);

  return null;
}
