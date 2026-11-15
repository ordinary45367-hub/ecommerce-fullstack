import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma.js";
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    return done(error);
  }
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
          },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
              googleId: profile.id,
              thumbnail: profile.photos[0]?.value,
              authProvider: "google",
            },
          });
        }
        done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
