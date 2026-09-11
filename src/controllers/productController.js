import prisma from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createProduct = catchAsync(async (req, res) => {
  const { name, description, price, imageUrl, stock, catalogId, categoryId } = req.body;

  const catalog = await prisma.catalog.findUnique({ where: { id: catalogId } });

  if (!catalog) {
    const error = new Error("Catálogo no encontrado");
    error.status = 404;
    throw error;
  }

  if (catalog.userId !== req.user.userId) {
    const error = new Error("No puedes agregar productos a un catálogo que no es tuyo");
    error.status = 403;
    throw error;
  }

  const product = await prisma.product.create({
    data: { name, description, price, imageUrl, stock, catalogId, categoryId },
  });

  res.status(201).json(product);
});

export const getProducts = catchAsync(async (req, res) => {
  const { categoryId, catalogId, search, page = 1, limit = 10 } = req.query;

  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (catalogId) where.catalogId = catalogId;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, catalog: true },
      skip,
      take: limitNum,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

export const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, catalog: true },
  });

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  res.json(product);
});

export const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, stock, categoryId } = req.body;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { catalog: true },
  });

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  if (product.catalog.userId !== req.user.userId) {
    const error = new Error("No tienes permiso para editar este producto");
    error.status = 403;
    throw error;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { name, description, price, imageUrl, stock, categoryId },
  });

  res.json(updated);
});

export const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { catalog: true },
  });

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  if (product.catalog.userId !== req.user.userId) {
    const error = new Error("No tienes permiso para borrar este producto");
    error.status = 403;
    throw error;
  }

  await prisma.product.delete({ where: { id } });

  res.status(204).send();
});