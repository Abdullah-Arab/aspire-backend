// src/routes/authRouter.ts

import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../../db/schema"; // Adjust if needed
import { db } from "../../db/index"; // Import your db instance
import { validateData } from "../../middleware/validationMiddleware";
import { uuid } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import User from "../../types/User";

// JWT Secret and Expiry Time from environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const authRouter = express.Router();

// Signup Schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Generate JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Register Route
authRouter.post(
  "/register",
  validateData(signupSchema),
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with a unique ID
    // Generate a unique ID
    const id = uuid().toString(); // Convert UUID to string

    // Create a new user
    const newUser: User = {
      id,
      email,
      password: hashedPassword,
      name,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      is_deleted: null,
    };
    await db.insert(users).values(newUser);

    // Generate a token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  })
);

// Login Route
authRouter.post(
  "/login",
  validateData(loginSchema),
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if the user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a token
    const token = generateToken(user.id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  })
);

export default authRouter;
