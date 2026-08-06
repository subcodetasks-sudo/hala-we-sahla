import { NextResponse } from "next/server"

export const runtime = "nodejs"

const ALLOWED_HOST_SUFFIXES = [
  "subcodeco.com",
  "hala-we-sahla.vercel.app",
  "localhost",
  "127.0.0.1",
]

function isAllowedContractUrl(raw: string) {
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:" && url.protocol !== "http:") return false

    const host = url.hostname.toLowerCase()
    return ALLOWED_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    )
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get("url")?.trim()

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  if (!isAllowedContractUrl(target)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 })
  }

  try {
    const upstream = await fetch(target, {
      cache: "no-store",
      headers: {
        Accept: "application/pdf,*/*",
      },
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch contract" },
        { status: upstream.status },
      )
    }

    const bytes = await upstream.arrayBuffer()
    const contentType =
      upstream.headers.get("content-type") || "application/pdf"

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType.includes("pdf")
          ? "application/pdf"
          : contentType,
        "Content-Disposition": "inline; filename=\"musaned-contract.pdf\"",
        "Cache-Control": "private, max-age=60",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Could not load contract" },
      { status: 502 },
    )
  }
}
