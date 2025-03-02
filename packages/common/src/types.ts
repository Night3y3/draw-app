const { z } = require("zod");

const CreateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
});

const SignInSchema = CreateUserSchema.pick({
  username: true,
  password: true,
});

module.exports = {
  CreateUserSchema,
  SignInSchema,
};
