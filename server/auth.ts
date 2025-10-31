import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { User, SafeUser } from "@shared/schema";

// Configure passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        
        if (!user) {
          return done(null, false, { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        if (!user.isActive) {
          return done(null, false, { message: "هذا الحساب غير مفعل" });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        
        if (!isValidPassword) {
          return done(null, false, { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        // Update last login
        await storage.updateUserLastLogin(user.id);

        // Return user without password hash
        const { passwordHash, ...safeUser } = user;
        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as SafeUser).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    if (!user) {
      return done(null, false);
    }
    const { passwordHash, ...safeUser } = user;
    done(null, safeUser);
  } catch (error) {
    done(error);
  }
});

export default passport;
