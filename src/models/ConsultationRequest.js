import mongoose from 'mongoose';

const ConsultationRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        destinationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination',
            required: true,
        },
        destinationTitle: {
            type: String,
            required: true,
        },
        destinationCountry: {
            type: String,
            required: true,
        },
        destinationImageUrl: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        preferredDate: {
            type: Date,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        travelers: {
            type: Number,
            required: true,
            min: 1,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'replied', 'contacted', 'closed'],
            default: 'pending',
        },
        adminReply: {
            type: String,
        },
        adminNote: {
            type: String,
        },
        repliedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ConsultationRequest || mongoose.model('ConsultationRequest', ConsultationRequestSchema);
