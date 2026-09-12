"use client"

type Props = {
  compact?: boolean
}

export default function NoleraBrand({ compact = false }: Props) {
  return (
    <div
      className={`flex items-center gap-2 ${
        compact ? "scale-90" : ""
      }`}
      aria-label="NOLERA X"
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute text-5xl font-black leading-none text-yellow-400/30">
          X
        </span>
        <span className="relative z-10 text-sm font-black tracking-tight text-white">
          NR
        </span>
      </div>

      <div className="leading-none">
        <div className="text-sm font-black tracking-[0.18em] text-white">
          NOLERA
        </div>
        <div className="text-[9px] font-bold tracking-[0.35em] text-yellow-300">
          X
        </div>
      </div>
    </div>
  )
}
