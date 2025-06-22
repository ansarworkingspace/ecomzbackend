import express from "express";
import { registerUserController } from "../controllers/user.controller";

const router = express.Router();

// Registration route
router.post("/customerRegister", registerUserController);

export default router;
