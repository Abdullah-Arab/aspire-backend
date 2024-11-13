import { goals } from "../db/schema";

type Goal = typeof goals.$inferSelect;

export default Goal;
