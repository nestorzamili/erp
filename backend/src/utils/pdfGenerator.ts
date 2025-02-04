import puppeteer from 'puppeteer'

export const generatePdf = async (htmlContent: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
    ],
  })
  const page = await browser.newPage()

  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
  })

  // Generate and return the PDF buffer
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm',
    },
    printBackground: true,
    preferCSSPageSize: true,
  })

  await browser.close()
  return Buffer.from(pdfBuffer)
}
