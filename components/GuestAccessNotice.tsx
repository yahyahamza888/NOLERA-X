"use client"

import Link from "next/link"

type Props = {
  title?: string
  message?: string
}

export default function GuestAccessNotice({
  title = "Sign in required",
  message = "Please sign in or create an account to continue with this financial service.",
}: Props) {
  return (
    <div className="mx-auto my-6 max-w-xl rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-center text-white">
      <div className="mb-2 text-lg font-bold">{title}</div>
      <p className="mb-4 text-sm text-white/70">{message}</p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/login"
          className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
        >
          Sign In
        </Link>

        <Link
          href="/register"
          className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white"
        >
          Create Account
        </Link>

        <Link
          href="/guest"
          className="rounded-xl border border-yellow-400/30 px-5 py-3 font-bold text-yellow-300"
        >
          Back to Guest
        </Link>
      </div>
    </div>
  )
}
