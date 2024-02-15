import User from "@/models/user";
import { connectDb } from "./db";
import bcrypt from 'bcrypt';

async function handler(req, res) {
  try {
    await connectDb();

    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);

  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export default handler;