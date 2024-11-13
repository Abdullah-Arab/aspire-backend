import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // or any other type you want for user
  }
}
