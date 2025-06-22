import express from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/user.controller";
import {
  handleValidationErrors,
  loginValidator,
  registerValidation,
} from "../validator/user.validator";

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

export default router;
