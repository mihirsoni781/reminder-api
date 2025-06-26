import mongoose, { Mongoose } from "mongoose";

const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateTimeEpoch: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    executed: {
        type: Boolean,
        required: false,
    }
}, { timestamps: true });

const Reminder = mongoose.model("reminder", reminderSchema, 'reminder');

export default Reminder;
