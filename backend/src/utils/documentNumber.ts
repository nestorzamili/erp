import prisma from '../config/db'

export const generateDocumentNumber = async (
  documentType: string,
): Promise<string> => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const romanMonths = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ]
  const monthRoman = romanMonths[month - 1]

  const documentCounter = await prisma.documentCounter.upsert({
    where: {
      document_type_year_month: {
        document_type: documentType,
        year,
        month,
      },
    },
    update: {
      last_sequence: { increment: 1 },
    },
    create: {
      document_type: documentType,
      year,
      month,
      last_sequence: 1,
    },
  })

  const sequence = String(documentCounter.last_sequence).padStart(4, '0')
  return `${sequence}/${documentType}/NAV/${monthRoman}/${year}`
}
