import { Router } from "express";
import {
  createCatalog,
  getCatalogs,
  getCatalogById,
  updateCatalog,
  deleteCatalog,
} from "../controllers/catalogController.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createCatalogSchema, updateCatalogSchema } from "../validators/catalogValidators.js";

const router = Router();

router.get("/", getCatalogs);
router.get("/:id", getCatalogById);
router.post("/", authenticate, validate(createCatalogSchema), createCatalog);
router.put("/:id", authenticate,validate(updateCatalogSchema), updateCatalog);
router.delete("/:id", authenticate, deleteCatalog);

export default router;