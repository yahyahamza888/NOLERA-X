"use client"

import Link from "next/link"
import NoleraBrand from "../../components/NoleraBrand"

export default function SecurityPage() {
  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#12091d] px-5 py-6 text-white"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <NoleraBrand compact />

          <Link
            href="/"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm"
          >
            Home
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6">
            <div className="mb-2 text-3xl">🔐</div>

            <h1 className="text-2xl font-black">
              Security Center
            </h1>

            <p className="mt-2 text-sm text-white/60">
              Protect your NOLERA X account and financial activity.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="font-bold">
                Account Password
              </div>

              <div className="mt-1 text-sm text-white/60">
                Use a strong password and never share it with anyone.
              </div>
            </div>

            <Link
              href="/verification"
              className="block rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:bg-white/10"
            >
              <div className="font-bold">
                Identity Verification
              </div>

              <div className="mt-1 text-sm text-white/60">
                Complete your NOLERA X verification to unlock protected
                financial services.
              </div>
            </Link>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">
              <div className="font-bold text-yellow-300">
                Passkey / Device Biometrics
              </div>

              <div className="mt-1 text-sm text-white/60">
                Passkeys can use your device fingerprint, Face ID, or
                screen lock without NOLERA X receiving or storing your
                biometric data.
              </div>

              <div className="mt-3 text-xs text-yellow-300/70">
                Secure WebAuthn integration is prepared for a later step.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="font-bold">
                Sensitive Actions
              </div>

              <div className="mt-1 text-sm text-white/60">
                Wallet, transfers, withdrawals, exchanges and verification
                require an authenticated account.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
