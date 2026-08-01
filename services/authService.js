import User from "../models/User.js";
import bcrypt from "bcrypt";

export const ensureAdminSeed = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@metro.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: "Admin",
    email: adminEmail,
    password: passwordHash,
    role: "admin",
  });

  console.log("Default admin user created:", adminEmail);
};
