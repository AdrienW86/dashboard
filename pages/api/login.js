require('dotenv').config()
import User from "@/models/user";
import { connectDb } from "./db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function handler(req, res) {
  try {
    const { email, password } = req.body;
    await connectDb();

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.NEXT_PUBLIC_JWT_SECRET);
    res.status(200).json({ token });

  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;