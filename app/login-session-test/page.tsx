"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/nolera-auth"

export default function LoginSessionTestPage() {
  const [result, setResult] = useState("جاري الفحص...")

  useEffect(() => {
    async function test() {
      try {
        const supabase = getSupabaseClient()

        const { data, error } = await supabase.auth.getSession()

        setResult(
          JSON.stringify(
            {
              sessionExists: !!data.session,
              userId: data.session?.user?.id ?? null,
              email: data.session?.user?.email ?? null,
              error: error?.message ?? null,
              url: window.location.href,
            },
            null,
            2
          )
        )
      } catch (error) {
        setResult(
          error instanceof Error ? error.message : String(error)
        )
      }
    }

    test()
  }, [])

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#fff",
        color: "#111",
      }}
    >
      <h1>NOLERA X — فحص الجلسة</h1>

      <pre
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#f1f5f9",
          borderRadius: "15px",
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </main>
  )
}
