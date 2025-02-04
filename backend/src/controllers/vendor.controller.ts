import { Request, Response } from 'express'
import prisma from '../config/db'
import logger from '../config/logger'

// Get all vendors
export const getVendors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany()
    res.status(200).json(vendors)
  } catch (error) {
    logger.error('Error in getVendors: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get vendor by id
export const getVendorById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vendorId = Number(req.params.id)
  try {
    const vendor = await prisma.vendor.findUnique({
      where: {
        vendor_id: vendorId,
      },
    })
    res.status(200).json(vendor)
  } catch (error) {
    logger.error('Error in getVendorById: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Create a new vendor
export const createVendor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { vendor_name, vendor_address, vendor_contact } = req.body
  try {
    const vendor = await prisma.vendor.create({
      data: {
        vendor_name,
        vendor_address,
        vendor_contact,
      },
    })
    res.status(201).json(vendor)
  } catch (error) {
    logger.error('Error in createVendor: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update a vendor
export const updateVendor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vendorId = Number(req.params.id)
  const { vendor_name, vendor_address, vendor_contact } = req.body
  try {
    const vendor = await prisma.vendor.update({
      where: {
        vendor_id: vendorId,
      },
      data: {
        vendor_name,
        vendor_address,
        vendor_contact,
      },
    })
    res.status(200).json(vendor)
  } catch (error) {
    logger.error('Error in updateVendor: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete a vendor
export const deleteVendor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vendorId = Number(req.params.id)
  try {
    await prisma.vendor.delete({
      where: {
        vendor_id: vendorId,
      },
    })
    res.status(200).json({ message: 'Vendor deleted' })
  } catch (error) {
    logger.error('Error in deleteVendor: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get all vendor invoices
export const getVendorInvoices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const vendorInvoices = await prisma.vendorInvoice.findMany()
    res.status(200).json(vendorInvoices)
  } catch (error) {
    logger.error('Error in getVendorInvoices: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get vendor invoice by id
export const getVendorInvoiceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vendorInvoiceId = Number(req.params.id)
  try {
    const vendorInvoice = await prisma.vendorInvoice.findUnique({
      where: {
        vendor_invoice_id: vendorInvoiceId,
      },
    })
    res.status(200).json(vendorInvoice)
  } catch (error) {
    logger.error('Error in getVendorInvoiceById: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Create a new vendor invoice
export const createVendorInvoice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { invoice_date, due_date, total_amount, status, vendor_id } = req.body
  try {
    const vendorInvoice = await prisma.vendorInvoice.create({
      data: {
        invoice_date: new Date(invoice_date),
        due_date: new Date(due_date),
        total_amount,
        status,
        vendor_id,
      },
    })
    res.status(201).json(vendorInvoice)
  } catch (error) {
    logger.error('Error in createVendorInvoice: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update a vendor invoice
export const updateVendorInvoice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vendorInvoiceId = Number(req.params.id)
  const { invoice_date, due_date, total_amount, status, vendor_id } = req.body
  try {
    const vendorInvoice = await prisma.vendorInvoice.update({
      where: {
        vendor_invoice_id: vendorInvoiceId,
      },
      data: {
        invoice_date: new Date(invoice_date),
        due_date: new Date(due_date),
        total_amount,
        status,
        vendor_id,
      },
    })
    res.status(200).json(vendorInvoice)
  } catch (error) {
    logger.error('Error in updateVendorInvoice: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete a vendor invoice
export const deleteVendorInvoice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const vendorInvoiceId = Number(req.params.id)

  // check if vendor invoice exists
  const vendorInvoice = await prisma.vendorInvoice.findUnique({
    where: {
      vendor_invoice_id: vendorInvoiceId,
    },
  })

  if (!vendorInvoice) {
    res.status(404).json({ message: 'Vendor invoice not found' })
    return
  }

  try {
    await prisma.vendorInvoice.delete({
      where: {
        vendor_invoice_id: vendorInvoiceId,
      },
    })
    res.status(200).json({ message: 'Vendor invoice deleted' })
  } catch (error) {
    logger.error('Error in deleteVendorInvoice: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
