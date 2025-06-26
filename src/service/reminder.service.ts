import mongoose from "mongoose";
import { ReminderRequest } from "../dto/request/ReminderRequest";
import { ReminderListResponse } from "../dto/response/ReminderResponse";
import Reminder from "../model/Reminder";
import User from '../model/User';
import { sendMail } from "../utils/nodemailer";

async function createReminder(reminderReq: ReminderRequest, userId: string) {
    const reminder = new Reminder({
        title: reminderReq.title,
        description: reminderReq.description,
        dateTimeEpoch: reminderReq.dateTimeEpoch,
        userId,
    });
    return reminder.save();
}

async function getAllReminders(userId: string, type: string): Promise<ReminderListResponse> {
    let startWith = type === 'upcoming' ? Math.floor(Date.now() / 1000) : 0;
    const reminders = await Reminder.find({
        userId,
        dateTimeEpoch: {
            $gt: startWith,
        }
    }).sort({ dateTimeEpoch: 1 });
    const reminderList: ReminderListResponse = {
        reminders: reminders.map(reminder => ({
            _id: reminder._id.toString(),
            title: reminder.title,
            description: reminder.description,
            dateTimeEpoch: reminder.dateTimeEpoch
        }))
    }
    return reminderList;
}

async function updateReminder(id: string, reminderReq: ReminderRequest, userId: string) {
    const reminder = await Reminder.findOne({ _id: id, userId }).exec();
    if (!reminder?._id) {
        throw new Error('Reminder not found !')
    }
    reminder.title = reminderReq.title;
    reminder.description = reminderReq.description;
    if (reminderReq.dateTimeEpoch > reminder.dateTimeEpoch) {
        reminder.executed = false;
    } else {
        reminder.executed = true;
    }
    reminder.dateTimeEpoch = reminderReq.dateTimeEpoch;
    return reminder.save();
}

async function deleteReminder(id: string, userId: number) {
    const reminder = await Reminder.findOneAndDelete({ _id: id, userId }).exec();
    return true;
}

async function fetchCurrentRemindersAndExecute() {
    const reminders = await Reminder.find({
        dateTimeEpoch: {
            $lte: Math.ceil(Date.now() / 1000),
        },
        executed: {
            $ne: true
        },
    }).populate('userId', '', User);
    reminders.forEach(async (reminder) => {
        const user = (reminder.userId as unknown) as { email: string };
        await sendMail({
            from: `"Reminder 💡" <${process.env.APP_EMAIL}>`,
            to: user.email,
            subject: reminder.title,
            text: reminder.description,
        });
        reminder.executed = true;
        await reminder.save()
    })
}

export default {
    createReminder,
    getAllReminders,
    updateReminder,
    deleteReminder,
    fetchCurrentRemindersAndExecute,
};
