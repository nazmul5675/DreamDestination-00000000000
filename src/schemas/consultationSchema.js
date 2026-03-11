import { z } from 'zod';

export const consultationSchema = z.object({
    destinationId: z.string().min(1, 'Destination ID is required'),
    destinationTitle: z.string().min(1, 'Destination title is required'),
    destinationCountry: z.string().min(1, 'Destination country is required'),
    destinationImageUrl: z.string().url('Invalid image URL'),
    phone: z.string().min(5, 'Valid phone number is required'),
    preferredDate: z.string().min(1, 'Preferred date is required'), // Validated as string then converted to Date
    budget: z.coerce.number().min(1, 'Budget must be at least 1'),
    travelers: z.coerce.number().min(1, 'At least 1 traveler is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const adminReplySchema = z.object({
    status: z.enum(['pending', 'replied', 'contacted', 'closed']),
    adminReply: z.string().optional(),
    adminNote: z.string().optional(),
});
