export interface User {
    user_id: number;
    us_id: number | null;
    user_name: string;
    user_password: string;
}

export interface UserSession {
    us_id: number;
    user_id: number;
    us: string;
}