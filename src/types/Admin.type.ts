import { z } from 'zod';

export const adminSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.string().email('El correo debe ser válido'),
  clerk_user_id: z.string(),
  stripe_account: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Admin = z.infer<typeof adminSchema>;
