import puppeteer from 'puppeteer'

export const generatePdf = async (htmlContent: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-accelerated-2d-canvas',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-cache',
      '--disable-component-extensions-with-background-pages',
      '--disable-crash-reporter',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gpu',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-mojo-local-storage',
      '--disable-notifications',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-software-rasterizer',
      '--ignore-certificate-errors',
      '--log-level=3',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--renderer-process-limit=100',
      '--enable-gpu-rasterization',
      '--enable-zero-copy',
    ],
  })
  const page = await browser.newPage()

  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
  })

  // Generate and return the PDF buffer
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  })

  await browser.close()
  return Buffer.from(pdfBuffer)
}
