import express, { Request, Response } from "express";
import { db } from "../../db";
import asyncHandler from "express-async-handler";

import { v4 as uuidv4 } from "uuid";
import { and, eq, gte } from "drizzle-orm";
import { z } from "zod";
import { validateData } from "../../middleware/validationMiddleware";
import { getUserByPhone, createUser } from "../../utils/userUtils";
import User from "../../types/User";
import Streak from "../../types/Streak";
import { userStreaks } from "../../db/schema";

const streakRecordSchemma = z.object({
  phone: z.string().min(10).max(10),
});

const getStreakSchemma = z.object({
  phone: z.string().min(10).max(10),
  limit: z.number(),
});

const streakRouter = express.Router();

// Endpoint to record user streak
streakRouter.post(
  "/",
  validateData(streakRecordSchemma),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // get user phone number
      const phoneNumber = req.body.phone;

      // get user from db
      var user = await getUserByPhone(phoneNumber);

      // if user does not exist, create user
      if (!user) {
        user = await createUser(phoneNumber);
      }

      // Check if the user has already registered their streak for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingStreak = await db
        .select()
        .from(userStreaks)
        .where(
          and(
            eq(userStreaks.user_id, user.id),
            gte(userStreaks.date_opened, today)
          )
        );
      if (existingStreak.length > 0) {
        res.status(400).send("Already registered");
        return;
      }

      // Record user streak and respond with success
      const userStreak: Streak = {
        id: uuidv4(),
        user_id: user.id,
        date_opened: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      await db.insert(userStreaks).values(userStreak).execute();
      res.status(200).send("Streak recorded successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      throw err;
    }
  })
);

// Endpoint to get user streak
streakRouter.get(
  "/",
  validateData(getStreakSchemma),
  asyncHandler((req: Request, res: Response) => {
    // get user phone number
    const phoneNumber = req.body.phone;
    const limit = req.body.limit;

    // get user from db
    getUserByPhone(phoneNumber).then((user: User | null) => {
      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      // get user streaks
      db.select()
        .from(userStreaks)
        .where(eq(userStreaks.user_id, user.id))
        .limit(limit)
        .execute()
        .then((streaks: Streak[]) => {
          res.send(streaks);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Internal Server Error");
          throw err;
        });
    });
  })
);

export default streakRouter;
