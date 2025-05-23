import { z } from 'zod';

export const adminSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  first_last_name: z.string().optional(),
  second_last_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('El correo debe ser válido'),
  clerk_user_id: z.string(),
  stripe_account: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  onboarding_finished: z.boolean().optional(),
  stripe_status: z.enum(['error', 'success']),
  restaurants: z.array(z.object({
    id: z.number(),
  })),
});

export type Admin = z.infer<typeof adminSchema>;
