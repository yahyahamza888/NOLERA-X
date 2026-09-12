"use client"

import Link from "next/link"

type Props = {
  title?: string
  message?: string
}

export default function SecurityNotice({
  title = "Security protected",
  message = "Sensitive financial services require a secure NOLERA X account.",
}: Props) {
  return (
    <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">🔐</span>
        <h2 className="font-bold">{title}</h2>
      </div>

      <p className="mb-4 text-sm text-white/70">{message}</p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/verification"
          className="rounded-xl bg-yellow-400 px-4 py-2 font-bold text-black"
        >
          Verification
        </Link>

        <Link
          href="/security"
          className="rounded-xl border border-white/20 px-4 py-2 font-bold"
        >
          Security Center
        </Link>
      </div>
    </div>
  )
}
