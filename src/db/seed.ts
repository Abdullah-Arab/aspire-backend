import { db } from "./index"; // Adjust this path based on your setup
import { users, userStreaks } from "./schema"; // Adjust this path based on your setup
import { v4 as uuidv4 } from "uuid";

async function seed() {
  try {
    // Step 1: Clear existing data (optional but helpful for re-seeding)
    await db.delete(users);
    await db.delete(userStreaks);

    // Step 2: Insert sample users
    const user1Id = uuidv4();
    const user2Id = uuidv4();

    await db.insert(users).values([
      {
        id: user1Id,
        phone: "1234567890",
      },
      {
        id: user2Id,
        phone: "0987654321",
      },
    ]);

    console.log("Users seeded:", [
      { id: user1Id, phone_number: "1234567890" },
      { id: user2Id, phone_number: "0987654321" },
    ]);

    // Step 3: Insert sample streak records for the past week
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date;
    });

    const streakData = [
      { user_id: user1Id, date_opened: dates[0] },
      { user_id: user1Id, date_opened: dates[1] },
      { user_id: user1Id, date_opened: dates[2] },
      { user_id: user1Id, date_opened: dates[4] }, // Skipping one day to break the streak
      { user_id: user2Id, date_opened: dates[0] },
      { user_id: user2Id, date_opened: dates[1] },
      { user_id: user2Id, date_opened: dates[2] },
      { user_id: user2Id, date_opened: dates[3] },
      { user_id: user2Id, date_opened: dates[4] },
      { user_id: user2Id, date_opened: dates[5] },
      { user_id: user2Id, date_opened: dates[6] },
    ];

    await db.insert(userStreaks).values(streakData);

    console.log("Streak records seeded:", streakData);
    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
  // finally {
  //   await db.end(); // Close database connection if necessary
  // }
}

seed().catch((error) => console.error("Error in seed script:", error));
