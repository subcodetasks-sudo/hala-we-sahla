/** Strip scripts/handlers; keep CMS markup and inline color styles. */
export function sanitizeCmsHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?iframe\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "")
    .trim()
}

/** Prefer inner content of a wrapping tag so we keep our own semantics. */
export function unwrapHtmlTag(html: string, tag: string) {
  const pattern = new RegExp(
    `^\\s*<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>\\s*`,
    "i",
  )
  const match = html.match(pattern)
  return match ? match[1].trim() : html.trim()
}

export function stripEmptyParagraphs(html: string) {
  return html.replace(/<p>\s*<\/p>/gi, "").trim()
}

/** Plain text from CMS HTML while keeping basic entity decoding. */
export function stripHtmlTags(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Split CMS legal sections into intro body + bullet items when a list is present. */
export function parseLegalSectionHtml(html: string): {
  body?: string
  items?: string[]
  contentHtml?: string | null
} {
  const sanitized = stripEmptyParagraphs(sanitizeCmsHtml(html))
  if (!sanitized) {
    return {}
  }

  const items: string[] = []
  let remainder = sanitized

  for (const ulMatch of sanitized.matchAll(/<ul[\s\S]*?<\/ul>/gi)) {
    const ulHtml = ulMatch[0]
    remainder = remainder.replace(ulHtml, "")

    for (const liMatch of ulHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
      const text = stripHtmlTags(liMatch[1] ?? "")
      if (text) {
        items.push(text)
      }
    }
  }

  if (items.length > 0) {
    const body = stripHtmlTags(remainder)
    return {
      body: body || undefined,
      items,
      contentHtml: null,
    }
  }

  return { contentHtml: sanitized }
}
