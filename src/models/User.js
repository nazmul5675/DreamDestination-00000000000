import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: function () {
                return this.provider === 'credentials';
            },
        },
        image: {
            type: String,
        },
        provider: {
            type: String,
            enum: ['credentials', 'google'],
            default: 'credentials',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);