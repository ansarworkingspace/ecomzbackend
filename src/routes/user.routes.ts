// import express from "express";
// import { registerUserController } from "../controllers/user.controller";

// const router = express.Router();

// // Registration route
// router.post("/customerRegister", registerUserController);

// export default router;

import express from "express";
import { registerUserController } from "../controllers/user.controller";
import {
  handleValidationErrors,
  registerValidation,
} from "../validator/user.validator";

const router = express.Router();

// Registration route with validation and rate limiting
router.post(
  "/customerRegister",
  registerValidation,
  handleValidationErrors,
  registerUserController
);

export default router;
