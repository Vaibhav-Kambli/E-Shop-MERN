import express from "express";
const router = express.Router();
// import { protect, isAdmin } from "../middleware/authMiddleware.js";

import { paymentRequest } from "../controllers/orderController.js";

router.route("/").post(paymentRequest);

export default router;
