import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { success } from "zod";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ msg: "all field must be filled" });
    }
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.json({ msg: "allready exist", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.json({ msg: "registerd", success: "true" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "Please provide both email and password",
        success: false,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({
        msg: "user doesn't exist! please signUp first",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          msg: "password is incorrect",
          success: false,
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,

      msg: "Logged in successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      // 👇 Added `return` and changed to 401
      return res.status(401).json({ success: false, msg: "You have to login" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};
export const logout = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/auth/login");
};
