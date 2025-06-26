import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User';
import { JWT_SECRET } from '../const/defaults';


async function registerUser(userData: { email: string; password: string; name: string }) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
    });
    await user.save();
    return { id: user._id, email: user.email, name: user.name };
}

async function generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
    return { accessToken, accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000};
}

async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const tokens = await generateTokens(user._id.toString());
    return { ...tokens, user: { id: user._id, email: user.email, name: user.name } };
}

export default {
    registerUser,
    loginUser,
    generateTokens
};