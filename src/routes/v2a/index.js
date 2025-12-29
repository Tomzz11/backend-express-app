import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js";

export const router = Router();
// this is v2
router.use("/users", usersRoutes);



