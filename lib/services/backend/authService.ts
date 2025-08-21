import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginService(body: any) {
  const { email, password } = loginSchema.parse(body);

  // 🔍 Find user in DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  // 🔑 Validate password
  let isPasswordValid = user.password === password;
  if (!isPasswordValid) {
    isPasswordValid = await bcrypt.compare(password, user.password);
  }
  if (!isPasswordValid) throw new Error("Invalid email or password");

  // 🪙 Generate JWT token with user ID as payload
  const token = generateToken({ userId: user.id }, "1d"); // token valid for 1 day

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
}
