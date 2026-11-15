import express from "express";
const router = express.Router();
import passport from "passport";
import { logout, login, register } from "../controllers/auth.controller.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
);

export default router;
