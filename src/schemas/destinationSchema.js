import { z } from 'zod';

export const destinationSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    country: z.string().min(2, 'Country is required'),
    location: z.string().min(2, 'Location is required'),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(150, 'Too long'),
    fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
    estimatedBudget: z.coerce.number().min(1, 'Budget must be at least 1'),
    bestSeason: z.string().min(2, 'Best season is required'),
    category: z.enum(['Beach', 'Mountain', 'City', 'Adventure', 'Nature', 'Historical'], {
        errorMap: () => ({ message: 'Please select a valid category' }),
    }),
    imageUrl: z.string().url('Invalid image URL').optional(),
});