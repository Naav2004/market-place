import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createCategorySchema } from "../validators/categoryValidators.js";

const router = Router();

router.get("/", getCategories);
router.post("/", authenticate,validate(createCategorySchema), createCategory);

export default router;