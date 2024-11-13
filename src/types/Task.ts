import { tasks } from "../db/schema";

type Task = typeof tasks.$inferSelect;

export default Task;
