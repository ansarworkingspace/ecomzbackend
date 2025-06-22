import express from "express";
import {
  imageUploadController,
  loginUserController,
  logoutController,
  registerUserController,
} from "../controllers/user.controller";
import {
  handleValidationErrors,
  loginValidator,
  registerValidation,
} from "../validator/user.validator";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

//REGISTER
router.post(
  "/customerRegister",
  registerValidation,
  handleValidationErrors,
  registerUserController
);

//LOGIN
router.post(
  "/login",
  loginValidator,
  handleValidationErrors,
  loginUserController
);

router.post("/logout", authenticateToken, logoutController);

router.post("/images", authenticateToken, imageUploadController);

export default router;
