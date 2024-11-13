// src/routes/authRouter.ts

import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { validateData } from "../../middleware/validationMiddleware";
import bcrypt from "bcryptjs";
import User from "../../types/User";
import { users } from "../../db/schema";
import jwt from "jsonwebtoken";
import { uuid } from "drizzle-orm/pg-core";

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
  "/register",
  validateData(signupSchema),
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
  })
);

export default authRouter;
