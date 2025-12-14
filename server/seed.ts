import bcrypt from "bcryptjs";
import { storage } from "./storage";

export async function seedAdminUser() {
  try {
    // ✅ Check for the NEW email
    const existingUser = await storage.getUserByEmail("abdallah@kayan.store");

    if (existingUser) {
      console.log("⏭️ Admin user 'abdallah@kayan.store' already exists, skipping");
      return;
    }

    // Create admin user with the NEW credentials
    console.log("👤 Seeding admin user 'abdallah@kayan.store'...");

    // ✅ Updated Password: Abdallah12345
    const passwordHash = await bcrypt.hash("Abdallah12345", 10);

    const adminUser = await storage.createUser({
      email: "abdallah@kayan.store",
      passwordHash,
      name: "Abdallah",
      role: "admin",
      isActive: true,
    });

    console.log("✅ Admin user created successfully:", adminUser.email);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}