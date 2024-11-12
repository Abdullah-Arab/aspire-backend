import { userStreaks } from "../db/schema";

type Streak = typeof userStreaks.$inferSelect;

export default Streak;
