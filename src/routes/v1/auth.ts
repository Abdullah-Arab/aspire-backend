// src/routes/authRouter.ts

import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { validateData } from "../../middleware/validationMiddleware"; //

// signup schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
});

// login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authRouter = express.Router();

// Register route
authRouter.get(
  "/",
  validateData(signupSchema),

  expressAsyncHandler(async (req: Request, res: Response) => {
    res.send("Register route");
  })
);

export default authRouter;
