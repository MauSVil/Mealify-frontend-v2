import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, 'El ID del usuario es obligatorio'),
  restaurant_id: z.number().min(1, 'El ID del restaurante es obligatorio'),
  driver_id: z.number().optional(),
  status: z.enum(['pending', 'restaurant_delayed', 'preparing', 'ready_for_pickup', 'in_progress', 'rider_delayed', 'delivered', 'cancelled_by_restaurant', 'cancelled_by_delivery', 'cancelled_by_user']).default('pending'),
  payment_status: z.enum(['pending', 'completed', 'failed', 'rejected']).default('pending'),
  total_price: z.coerce.number().nonnegative('El precio total debe ser positivo'),
  delivery_fee: z.coerce.number().nonnegative('La tarifa de entrega debe ser positiva'),
  payment_intent_id: z.string().min(1, 'El ID del intento de pago es obligatorio'),
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  delay_date: z.date().optional(),
  order_items: z.array(z.object({
    id: z.number(),
    order_id: z.number(),
    product_id: z.number(),
    quantity: z.number(),
    unit_price: z.string(),
    products: z.object({
      name: z.string(),
      price: z.string(),
      image_min: z.string(),
      description: z.string(),
    })
  })).optional(),
});

export type Order = z.infer<typeof orderSchema>;
