import express from "express";
import "dotenv/config";

import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";
import session from "express-session";
import authRoute from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRoute);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server start running on port 3000");
});
