"use client"

import { useRef, useState } from "react"
import { Camera, Image as ImageIcon, Video, X } from "lucide-react"

type Props = {
  label?: string
  accept?: string
  capture?: "user" | "environment"
  compact?: boolean
  onChange: (file: File | null, preview: string | null) => void
}

export default function MediaCapture({
  label = "إضافة صورة",
  accept = "image/*",
  capture,
  compact = false,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)

  function choose() {
    inputRef.current?.click()
  }

  function handleFile(file?: File) {
    if (!file) return

    const video = file.type.startsWith("video/")
    setIsVideo(video)

    if (video) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onChange(file, url)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result)
      setPreview(url)
      onChange(file, url)
    }
    reader.readAsDataURL(file)
  }

  function clear() {
    setPreview(null)
    setIsVideo(false)
    onChange(null, null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={compact ? "relative" : "rounded-2xl border border-slate-200 bg-slate-50 p-4"}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={capture}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className={compact ? "relative overflow-hidden rounded-xl" : "relative overflow-hidden rounded-2xl"}>
          {isVideo ? (
            <video
              src={preview}
              controls
              className="max-h-72 w-full object-cover"
            />
          ) : (
            <img
              src={preview}
              alt={label}
              className="max-h-72 w-full object-cover"
            />
          )}

          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-2 rounded-full bg-black/75 p-2 text-white"
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={choose}
          className={
            compact
              ? "flex items-center gap-2 rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-purple-50 hover:text-purple-600"
              : "flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-5 text-sm font-black text-slate-700 transition hover:bg-slate-100"
          }
        >
          {capture ? (
            <Camera size={20} />
          ) : accept.startsWith("video") ? (
            <Video size={20} />
          ) : (
            <ImageIcon size={20} />
          )}
          {!compact && label}
        </button>
      )}
    </div>
  )
}
