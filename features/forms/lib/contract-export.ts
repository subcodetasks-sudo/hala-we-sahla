import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const A4_WIDTH_PX = Math.round((210 / 25.4) * 96)
const A4_HEIGHT_PX = Math.round((297 / 25.4) * 96)

const PRINT_PAGE_STYLES = `
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    color: #000 !important;
  }
  .musaned-contract {
    background: #fff !important;
    padding: 0 !important;
  }
  .musaned-page {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    overflow: hidden !important;
    page-break-after: always;
    break-after: page;
  }
  .musaned-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
`

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

/** Keep only a safe basename ending in `.pdf` (no paths / traversal). */
function safePdfFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop()?.trim() || "musaned-contract.pdf"
  const cleaned = base
    .replace(/[^\w.\u0600-\u06FF-]+/g, "-")
    .replace(/^\.+/, "")
    .replace(/-+/g, "-")
  const withExt = cleaned.toLowerCase().endsWith(".pdf")
    ? cleaned
    : `${cleaned || "musaned-contract"}.pdf`
  return withExt.slice(0, 180)
}

function collectStylesHtml(): string {
  return Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((node) => {
      if (node instanceof HTMLLinkElement) {
        // Only same-origin stylesheets — avoid injecting cross-origin URLs.
        try {
          const href = new URL(node.href, window.location.href)
          if (href.origin !== window.location.origin) return ""
        } catch {
          return ""
        }
      }
      return node.outerHTML
    })
    .filter(Boolean)
    .join("\n")
}

function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images)
  if (images.length === 0) return Promise.resolve()

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.addEventListener("load", () => resolve(), { once: true })
          img.addEventListener("error", () => resolve(), { once: true })
        }),
    ),
  ).then(() => undefined)
}

function getContractRoot(contractEl: HTMLElement): HTMLElement {
  return (
    contractEl.querySelector<HTMLElement>(".musaned-contract") ?? contractEl
  )
}

export async function printMusanedContract(
  contractEl: HTMLElement,
  title = "Musaned Contract",
): Promise<void> {
  // Must open synchronously within the click handler chain to avoid popup blockers.
  const printWindow = window.open("", "_blank", "width=900,height=700")
  if (!printWindow) {
    throw new Error("POPUP_BLOCKED")
  }

  const root = getContractRoot(contractEl)
  const safeTitle = escapeHtml(title)

  printWindow.document.open()
  printWindow.document.write(`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="referrer" content="no-referrer" />
    <title>${safeTitle}</title>
    ${collectStylesHtml()}
    <style>${PRINT_PAGE_STYLES}</style>
  </head>
  <body>${root.outerHTML}</body>
</html>`)
  printWindow.document.close()

  await waitForImages(printWindow.document)
  await new Promise((resolve) => setTimeout(resolve, 300))

  const closeWindow = () => {
    try {
      printWindow.close()
    } catch {
      // ignore
    }
  }

  printWindow.addEventListener("afterprint", closeWindow, { once: true })
  printWindow.focus()
  printWindow.print()
  // Fallback if afterprint is not fired (some browsers).
  window.setTimeout(closeWindow, 1500)
}

function createOffscreenClone(contractEl: HTMLElement): HTMLElement {
  const host = document.createElement("div")
  host.setAttribute("aria-hidden", "true")
  host.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    `width:${A4_WIDTH_PX}px`,
    "z-index:-1",
    "pointer-events:none",
    "opacity:1",
    "zoom:1",
    "background:#ffffff",
    "color:#000000",
  ].join(";")

  const clone = getContractRoot(contractEl).cloneNode(true) as HTMLElement
  clone.style.background = "#ffffff"
  clone.style.color = "#000000"
  clone.style.padding = "0"
  clone.style.zoom = "1"
  host.appendChild(clone)
  document.body.appendChild(host)

  return host
}

function prepareCloneForCapture(clonedDoc: Document) {
  const root = clonedDoc.querySelector<HTMLElement>(".musaned-contract")
  if (!root) return

  // Force print-faithful colors so theme tokens (oklch) never leak into capture.
  root.style.background = "#ffffff"
  root.style.color = "#000000"
  root.style.padding = "0"
  root.style.zoom = "1"

  clonedDoc.querySelectorAll<HTMLElement>(".musaned-page").forEach((page) => {
    page.style.width = `${A4_WIDTH_PX}px`
    page.style.height = `${A4_HEIGHT_PX}px`
    page.style.minHeight = `${A4_HEIGHT_PX}px`
    page.style.margin = "0 0 16px"
    page.style.boxShadow = "none"
    page.style.overflow = "hidden"
    page.style.background = "#ffffff"
    page.style.color = "#000000"
  })
}

function canvasToJpegDataUrl(canvas: HTMLCanvasElement): string {
  try {
    return canvas.toDataURL("image/jpeg", 0.92)
  } catch {
    // Tainted canvas / SecurityError — never use allowTaint.
    throw new Error("CANVAS_TAINTED")
  }
}

export async function downloadMusanedContractPdf(
  contractEl: HTMLElement,
  filename = "musaned-contract.pdf",
): Promise<void> {
  const safeName = safePdfFilename(filename)
  const host = createOffscreenClone(contractEl)

  try {
    const pages = Array.from(host.querySelectorAll<HTMLElement>(".musaned-page"))
    if (pages.length === 0) {
      throw new Error("NO_PAGES")
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index]
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        // Never taint the canvas — toDataURL would throw and export would fail.
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 15000,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
        onclone: prepareCloneForCapture,
      })

      const image = canvasToJpegDataUrl(canvas)
      if (index > 0) pdf.addPage()
      pdf.addImage(
        image,
        "JPEG",
        0,
        0,
        A4_WIDTH_MM,
        A4_HEIGHT_MM,
        undefined,
        "FAST",
      )
    }

    // Blob download avoids some browser quirks with data-URL saves.
    const blob = pdf.output("blob")
    const url = URL.createObjectURL(blob)
    try {
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = safeName
      anchor.rel = "noopener"
      anchor.style.display = "none"
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    } finally {
      URL.revokeObjectURL(url)
    }
  } finally {
    host.remove()
  }
}
