import express from "express";
import { getUserBalances } from "../controllers/balanceController.js";

const router = express.Router();

router.get("/:userId", getUserBalances);

export default router;
