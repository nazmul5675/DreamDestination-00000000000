import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        fullDescription: {
            type: String,
            required: true,
        },
        estimatedBudget: {
            type: Number,
            required: true,
        },
        bestSeason: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Beach', 'Mountain', 'City', 'Adventure', 'Nature', 'Historical'],
        },
        imageUrl: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdByEmail: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);