import { z } from 'zod';

// Định nghĩa schema cho product
export const productSchema = z.object({
  id: z.number(),
  general: z.object({
    name: z.string(),
    description: z.string(),
    brand: z.string(),
    category: z.string(),
  }),
  details: z.object({
    material: z.string(),
    careInstructions: z.array(z.string()),
    features: z.array(z.string()),
  }),
  variants: z.array(
    z.object({
      size: z.string(),
      colors: z.array(
        z.object({
          color: z.string(),
          price: z.number(),
          originalPrice: z.number(),
          stockStatus: z.string(),
        })
      ),
    })
  ),
  promotion: z.object({
    offer: z.string(),
    discountPercentage: z.number(),
  }),
});

export type Product = z.infer<typeof productSchema>;
