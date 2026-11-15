import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
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
    if (!email) {
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
      return res.json({
        msg: "user doesn't exist! please signUp first",
        success: false,
      });
    }
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
      { id: user.id, role: user.role },
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

    return res.status(200).json({
      success: true,
      msg: "Logged in successfully",
    });
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
