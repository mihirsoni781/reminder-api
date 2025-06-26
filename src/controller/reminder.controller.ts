import { Response, Request } from "express";
import reminderService from "../service/reminder.service";
import { ReminderRequest } from "../dto/request/ReminderRequest";

async function createReminder(req: Request, res: Response): Promise<void> {
    try {
        const reminderReq = req.body as ReminderRequest;
        const userId = req.app.get('userId'); // Assuming user ID is available in the request object
        const reminder = await reminderService.createReminder(reminderReq, userId);
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reminder' });
    }
}

async function getReminders(req: Request, res: Response): Promise<void> {
    try {
        const type = req.query.type?.toString() ?? 'all';
        const userId = req.app.get('userId');  // Assuming user ID is available in the request object
        const resp = await reminderService.getAllReminders(userId, type);
        res.status(200).json(resp.reminders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
}

async function updateReminder(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const body = req.body as ReminderRequest;
        const resp = await reminderService.updateReminder(id, body, req.app.get('userId'));
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update reminder' });
    }
}

async function deleteReminder(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const userId = req.app.get('userId');
        const resp = await reminderService.deleteReminder(id, userId);
        res.status(200).json({ deleted: resp });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reminder' })
    }
}

export default {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder,
};