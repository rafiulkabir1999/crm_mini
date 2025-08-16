import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  email: z.string().email().optional().or(z.literal("")),
})

export const leadSchema = z.object({
  userId: z.string().min(1, "User is required"),
  interestedProduct: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  leadSource: z.string().min(1, "Lead source is required"),
  notes: z.string().optional(),
  status: z.enum(["new", "contacted", "interested", "converted", "lost"]),
  followUpDate: z.date().optional(),
})

export const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.enum(["ads", "packaging", "delivery", "other"]),
  date: z.date(),
})
