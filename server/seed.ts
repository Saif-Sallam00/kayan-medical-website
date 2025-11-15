import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { db } from "./db"; // Added import
import { siteSettings, aboutPage } from "@shared/schema"; // Added import

export async function seedContent() {
  try {
    // Check if admin user already exists
    const existingUser = await storage.getUserByEmail(
      "faris@omniflowai.agency",
    );

    if (existingUser) {
      console.log("⏭️  Admin user already exists, skipping");
    } else {
      // Create admin user with the provided credentials
      console.log("👤 Seeding admin user...");
      const passwordHash = await bcrypt.hash("faris123456", 10);

      const adminUser = await storage.createUser({
        email: "faris@omniflowai.agency",
        passwordHash,
        name: "Faris",
        role: "admin",
        isActive: true,
      });

      console.log("✅ Admin user created successfully:", adminUser.email);
    }

    // Check if site settings already exist
    const existingSettings = await storage.getSiteSettings();
    if (!existingSettings) {
      console.log("⚙️ Seeding site settings...");
      await db.insert(siteSettings).values({}).returning();
      console.log("✅ Site settings seeded successfully");
    } else {
      console.log("⏭️  Site settings already exist, skipping");
    }

    // Check if about page content already exists
    const existingAbout = await storage.getAboutPage();
    if (!existingAbout) {
      console.log("ℹ️ Seeding about page content...");
      await db.insert(aboutPage).values({}).returning();
      console.log("✅ About page content seeded successfully");
    } else {
      console.log("⏭️  About page content already exist, skipping");
    }
  } catch (error) {
    console.error("Error seeding content:", error);
  }
}
