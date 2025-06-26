import { Request, Response } from "express";
import userService from "../service/user.service";
import userValidator from "../validator/user.validator";

async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const userData = req.body as AuthRequest;
        const error = userValidator.registerValidator.validate(userData).error?.message;
        if (error) {
            res.status(400).json({ error: error });
            return;
        }
        const user = await userService.registerUser(userData);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body as AuthRequest;
        const error = userValidator.loginValidator.validate({ email, password }).error?.message;
        if (error) {
            res.status(400).json({ error: error });
            return;
        }
        const user = await userService.loginUser(email, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
}

export default {
    registerUser,
    loginUser,
};
