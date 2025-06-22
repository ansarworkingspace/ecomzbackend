import express from "express";
const router = express.Router();
import categoryRoutes from "./category.routes";
import optionRoutes from "./option.routes";

router.use("/", categoryRoutes);
router.use("/", optionRoutes);

export default router;
