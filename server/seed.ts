import bcrypt from "bcryptjs";
import { storage } from "./storage";

export async function seedAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await storage.getUserByEmail("faris@omniflowai.agency");
    
    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user with the provided credentials
    const passwordHash = await bcrypt.hash("faris123456", 10);
    
    const adminUser = await storage.createUser({
      email: "faris@omniflowai.agency",
      passwordHash,
      name: "Faris",
      role: "admin",
      isActive: true,
    });

    console.log("✅ Admin user created successfully:", adminUser.email);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}
