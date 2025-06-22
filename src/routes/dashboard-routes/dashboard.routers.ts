import express from "express";
const router = express.Router();
import categoryRoutes from "./category.routes";
import optionRoutes from "./option.routes";
import productRoutes from "./product.routes";

router.use("/", categoryRoutes);
router.use("/", optionRoutes);
router.use("/", productRoutes);

export default router;
