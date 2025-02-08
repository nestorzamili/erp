import { Request, Response } from 'express'
import prisma from '../config/db'
import logger from '../config/logger'

// get 1 customer
export const getCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params

  try {
    const customer = await prisma.customer.findUnique({
      where: {
        customer_id: Number(id),
      },
    })

    if (!customer) {
      logger.error('Customer not found')
      res.status(404).json({ message: 'Customer not found' })
      return
    }

    logger.info('Customer found')
    res.json(customer)
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// get all customers
export const getCustomers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany()

    logger.info('Customers found')
    res.json(customers)
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// create customer
export const createCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    customer_name,
    customer_address,
    customer_contact,
    customer_company,
    customer_email,
    customer_code,
  } = req.body

  if (!customer_name) {
    logger.error('Customer name required')
    res.status(400).json({ message: 'Customer name required' })
    return
  }

  // check if customer email already exists
  const existingCustomer = await prisma.customer.findUnique({
    where: {
      customer_email,
    },
  })

  if (existingCustomer) {
    logger.error('Customer email already exists')
    res.status(400).json({ message: 'Customer email already exists' })
    return
  }

  // check if customer code already exists
  if (customer_code) {
    const existingCustomerCode = await prisma.customer.findFirst({
      where: {
        customer_code,
      },
    })

    if (existingCustomerCode) {
      logger.error('Customer code already exists')
      res.status(400).json({ message: 'Customer code already exists' })
      return
    }
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        customer_name,
        customer_address,
        customer_contact,
        customer_company,
        customer_email,
        customer_code,
      },
    })

    logger.info('Customer created')
    res.json(customer)
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// update customer
export const updateCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params
  const {
    customer_name,
    customer_address,
    customer_contact,
    customer_company,
    customer_email,
    customer_code,
  } = req.body

  try {
    const customer = await prisma.customer.update({
      where: {
        customer_id: Number(id),
      },
      data: {
        customer_name,
        customer_address,
        customer_contact,
        customer_company,
        customer_email,
        customer_code,
      },
    })

    logger.info('Customer updated')
    res.json(customer)
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// delete customer
export const deleteCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params

  try {
    await prisma.customer.delete({
      where: {
        customer_id: Number(id),
      },
    })

    logger.info('Customer deleted')
    res.json({ message: 'Customer deleted' })
  } catch (error) {
    logger.error('An unknown error occurred')
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
