import { Router } from 'express';
import reminderController from '../controller/reminder.controller';
import userController from '../controller/user.controller';
import { validateUser } from '../middleware/auth';

const router = Router();

router.post('/auth/login', userController.loginUser);
router.post('/auth/register', userController.registerUser);

router.use(validateUser);
router.get('/reminders', reminderController.getReminders);
router.post('/reminders', reminderController.createReminder);
router.put('/reminders/:id', reminderController.updateReminder);
router.delete('/reminders/:id', reminderController.deleteReminder);


export default router;
