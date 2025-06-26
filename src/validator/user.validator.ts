import Joi from 'joi';

const registerValidator = Joi.object({
    action: Joi.string().optional(),
    confirmPassword: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
}).required();

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
}).required();


export default {
    registerValidator,
    loginValidator,
};
