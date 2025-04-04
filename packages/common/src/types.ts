import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const SignInSchema = CreateUserSchema.pick({
  username: true,
  password: true,
});

export type SignInInput = z.infer<typeof SignInSchema>;

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
