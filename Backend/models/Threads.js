import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
    threadId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    messages: [
        {
            role: { type: String, enum: ['user', 'assistant'] },
            content: String
        }
    ]
}, { timestamps: true });

const Thread = mongoose.model('Thread', ThreadSchema);
export default Thread;