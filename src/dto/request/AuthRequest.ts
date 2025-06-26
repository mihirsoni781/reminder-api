type AuthRequest = {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    action: 'register' | 'login' ;
};
