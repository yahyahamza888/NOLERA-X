import { NextRequest, NextResponse } from "next/server"

const MONEY_PRINTER_URL =
  process.env.MONEY_PRINTER_TURBO_URL || "http://127.0.0.1:8080"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const topic = String(body?.topic || "").trim()

    if (!topic) {
      return NextResponse.json(
        { ok: false, error: "موضوع الفيديو مطلوب." },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${MONEY_PRINTER_URL}/api/v1/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          language: body?.language || "ar",
          video_size: body?.video_size || "9:16",
        }),
        cache: "no-store",
      }
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "MoneyPrinterTurbo رفض طلب إنشاء الفيديو.",
          details: data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      ok: true,
      data,
    })
  } catch (error) {
    console.error("NOLERA AI Video API Error:", error)

    return NextResponse.json(
      {
        ok: false,
        error:
          "محرك إنشاء الفيديو غير متصل حاليًا. سيتم ربط MoneyPrinterTurbo في المرحلة التالية.",
      },
      { status: 503 }
    )
  }
}
