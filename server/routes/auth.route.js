import express from "express";
const router = express.Router();
import passport from "passport";
import {
  logout,
  login,
  register,
  getMe,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/",
  }),
);

export default router;
