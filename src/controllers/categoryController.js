import prisma from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createCategory = catchAsync(async (req, res) => {
  if (req.user.role !== "admin") {
    const error = new Error("Solo un administrador puede crear categorías");
    error.status = 403;
    throw error;
  }

  const { name } = req.body;

  const category = await prisma.category.create({
    data: { name },
  });

  res.status(201).json(category);
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});