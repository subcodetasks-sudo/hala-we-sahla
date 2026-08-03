import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

const PRINT_PAGE_STYLES = `
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
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

function collectStylesHtml(): string {
  return Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((node) => node.outerHTML)
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

  printWindow.document.open()
  printWindow.document.write(`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
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
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;width:210mm;z-index:-1;pointer-events:none;opacity:1;zoom:1;"

  const clone = getContractRoot(contractEl).cloneNode(true) as HTMLElement
  clone.style.background = "#fff"
  clone.style.padding = "0"
  clone.style.zoom = "1"
  host.appendChild(clone)
  document.body.appendChild(host)

  return host
}

export async function downloadMusanedContractPdf(
  contractEl: HTMLElement,
  filename = "musaned-contract.pdf",
): Promise<void> {
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
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: Math.ceil(page.getBoundingClientRect().width) || 794,
        windowHeight: Math.ceil(page.getBoundingClientRect().height) || 1123,
      })

      const image = canvas.toDataURL("image/jpeg", 0.95)
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

    pdf.save(filename)
  } finally {
    host.remove()
  }
}
