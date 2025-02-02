import { Request, Response } from 'express'
import prisma from '../config/db'
import logger from '../config/logger'
import { generateDocumentNumber } from '../utils/documentNumber'

export const createQuotation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quotationDate, totalPrice, customerId, products } = req.body
  const userId = req.user.id

  try {
    const documentNumber = await generateDocumentNumber('QUOT')

    const quotation = await prisma.quotation.create({
      data: {
        quotation_date: new Date(quotationDate),
        total_price: totalPrice,
        document_number: documentNumber,
        customer_id: customerId,
        created_by: userId,
        products: {
          create: products.map((product: any) => ({
            product_id: product.productId,
            quantity: product.quantity,
            unit_price: product.unitPrice,
          })),
        },
      },
      include: {
        products: true,
      },
    })

    res.json({ message: 'Quotation created successfully', quotation })
    logger.info('Quotation created successfully')
  } catch (error) {
    logger.error('Error creating quotation:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const approveQuotation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quotationId } = req.params
  const { notes } = req.body
  const userId = req.user.id

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { quotation_id: parseInt(quotationId) },
    })

    if (!quotation) {
      res.status(404).json({ message: 'Quotation not found' })
      logger.warn('Quotation not found')
      return
    }

    if (quotation.created_by === userId) {
      res.status(403).json({ message: 'You cannot approve your own quotation' })
      logger.warn('You cannot approve your own quotation')
      return
    }

    if (quotation.approval_status === 'Approved') {
      res.status(400).json({ message: 'Quotation already approved' })
      logger.warn('Quotation already approved')
      return
    }

    const updatedQuotation = await prisma.quotation.update({
      where: { quotation_id: parseInt(quotationId) },
      data: {
        approval_status: 'Approved',
        approved_by: userId,
        approved_at: new Date(),
        approval_note: notes,
      },
    })

    res.json({ message: 'Quotation approved', quotation: updatedQuotation })
    logger.info('Quotation approved')
  } catch (error) {
    logger.error('Error approving quotation:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const rejectQuotation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quotationId } = req.params
  const { notes } = req.body
  const userId = req.user.id

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { quotation_id: parseInt(quotationId) },
    })

    if (!quotation) {
      res.status(404).json({ message: 'Quotation not found' })
      logger.warn('Quotation not found')
      return
    }

    if (quotation.created_by === userId) {
      res.status(403).json({ message: 'You cannot reject your own quotation' })
      logger.warn('You cannot reject your own quotation')
      return
    }

    const updatedQuotation = await prisma.quotation.update({
      where: { quotation_id: parseInt(quotationId) },
      data: {
        approval_status: 'Rejected',
        approved_by: userId,
        approved_at: new Date(),
        approval_note: notes,
      },
    })

    res.json({ message: 'Quotation rejected', quotation: updatedQuotation })
    logger.info('Quotation rejected')
  } catch (error) {
    logger.error('Error rejecting quotation:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Edit quotation
export const editQuotation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quotationId } = req.params
  const { quotationDate, totalPrice, customerId, status, products } = req.body
  const userId = req.user.id

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { quotation_id: parseInt(quotationId) },
      include: { products: true },
    })

    if (!quotation) {
      res.status(404).json({ message: 'Quotation not found' })
      logger.warn('Quotation not found')
      return
    }

    if (quotation.created_by !== userId) {
      res.status(403).json({ message: 'You cannot edit this quotation' })
      logger.warn('You cannot edit this quotation')
      return
    }

    await prisma.$transaction(async (tx) => {
      await tx.quotationProduct.deleteMany({
        where: { quotation_id: parseInt(quotationId) },
      })

      await tx.quotation.update({
        where: { quotation_id: parseInt(quotationId) },
        data: {
          quotation_date: new Date(quotationDate),
          total_price: totalPrice,
          customer_id: customerId,
          status,
          updated_at: new Date(),
        },
      })

      if (products.length > 0) {
        await tx.quotationProduct.createMany({
          data: products.map((product: any) => ({
            quotation_id: parseInt(quotationId),
            product_id: product.productId,
            quantity: product.quantity,
            unit_price: product.unitPrice,
          })),
          skipDuplicates: true,
        })
      }
    })

    res.json({ message: 'Quotation updated successfully' })
    logger.info('Quotation updated successfully')
  } catch (error) {
    logger.error('Error updating quotation:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Delete quotation
export const deleteQuotation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quotationId } = req.params
  const userId = req.user.id

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { quotation_id: parseInt(quotationId) },
    })

    if (!quotation) {
      res.status(404).json({ message: 'Quotation not found' })
      logger.warn('Quotation not found')
      return
    }

    if (quotation.created_by !== userId) {
      res.status(403).json({ message: 'You cannot delete this quotation' })
      logger.warn('You cannot delete this quotation')
      return
    }

    await prisma.$transaction(async (tx) => {
      await tx.quotationProduct.deleteMany({
        where: { quotation_id: parseInt(quotationId) },
      })

      await tx.quotation.delete({
        where: { quotation_id: parseInt(quotationId) },
      })
    })

    res.json({ message: 'Quotation deleted successfully' })
    logger.info(`Quotation ${quotationId} deleted successfully`)
  } catch (error) {
    logger.error('Error deleting quotation:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// get all quotations
export const getAllQuotations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const quotations = await prisma.quotation.findMany({
      include: {
        products: true,
        customer: true,
      },
    })

    res.json(quotations)
    logger.info('Quotations retrieved successfully')
  } catch (error) {
    logger.error('Error retrieving quotations:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// get single quotation
export const getQuotation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quotationId } = req.params

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { quotation_id: parseInt(quotationId) },
      include: {
        products: true,
        customer: true,
      },
    })

    if (!quotation) {
      res.status(404).json({ message: 'Quotation not found' })
      logger.warn('Quotation not found')
      return
    }

    res.json(quotation)
    logger.info('Quotation retrieved successfully')
  } catch (error) {
    logger.error('Error retrieving quotation:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
