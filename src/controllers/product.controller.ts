import { Request, Response } from 'express'
import prisma from '../config/db'
import logger from '../config/logger'

// Get all products
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await prisma.product.findMany()
    res.status(200).json(products)
  } catch (error) {
    logger.error('Error in getProducts: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get product by id
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = Number(req.params.id)
  try {
    const product = await prisma.product.findUnique({
      where: {
        product_id: productId,
      },
    })
    res.status(200).json(product)
  } catch (error) {
    logger.error('Error in getProductById: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { product_name, product_description, unit_price, stock_quantity } =
    req.body
  try {
    const product = await prisma.product.create({
      data: {
        product_name,
        product_description,
        unit_price,
        stock_quantity,
      },
    })
    res.status(201).json(product)
  } catch (error) {
    logger.error('Error in createProduct: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update a product
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = Number(req.params.id)
  const { product_name, product_description, unit_price, stock_quantity } =
    req.body
  try {
    const product = await prisma.product.update({
      where: {
        product_id: productId,
      },
      data: {
        product_name,
        product_description,
        unit_price,
        stock_quantity,
      },
    })
    res.status(200).json(product)
  } catch (error) {
    logger.error('Error in updateProduct: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete a product
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = Number(req.params.id)
  try {
    await prisma.product.delete({
      where: {
        product_id: productId,
      },
    })
    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    logger.error('Error in deleteProduct: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
