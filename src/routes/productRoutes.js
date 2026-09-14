import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidators.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, validate(createProductSchema), createProduct);
router.put("/:id", authenticate, validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, deleteProduct);
router.post("/upload-image", authenticate, upload.single("image"), uploadProductImage);

export default router;