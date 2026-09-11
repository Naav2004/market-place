import prisma from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createCatalog = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  const catalog = await prisma.catalog.create({
    data: { name, description, userId },
  });

  res.status(201).json(catalog);
});

export const getCatalogs = catchAsync(async (req, res) => {
  const catalogs = await prisma.catalog.findMany({
    include: { products: true },
  });
  res.json(catalogs);
});

export const getCatalogById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const catalog = await prisma.catalog.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!catalog) {
    const error = new Error("Catálogo no encontrado");
    error.status = 404;
    throw error;
  }

  res.json(catalog);
});

export const updateCatalog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const catalog = await prisma.catalog.findUnique({ where: { id } });

  if (!catalog) {
    const error = new Error("Catálogo no encontrado");
    error.status = 404;
    throw error;
  }

  if (catalog.userId !== req.user.userId) {
    const error = new Error("No tienes permiso para editar este catálogo");
    error.status = 403;
    throw error;
  }

  const updated = await prisma.catalog.update({
    where: { id },
    data: { name, description },
  });

  res.json(updated);
});

export const deleteCatalog = catchAsync(async (req, res) => {
  const { id } = req.params;

  const catalog = await prisma.catalog.findUnique({ where: { id } });

  if (!catalog) {
    const error = new Error("Catálogo no encontrado");
    error.status = 404;
    throw error;
  }

  if (catalog.userId !== req.user.userId) {
    const error = new Error("No tienes permiso para borrar este catálogo");
    error.status = 403;
    throw error;
  }

  await prisma.catalog.delete({ where: { id } });

  res.status(204).send();
});