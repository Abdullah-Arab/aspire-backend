import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";


const authRouter = express.Router();

authRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // return hello world
    // res.send("CI/CD is working... v28");


  })
);


export default authRouter;
