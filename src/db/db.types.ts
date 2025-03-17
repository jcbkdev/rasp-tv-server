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

export interface AuthDetails {
    user_id: number;
    user_name: string;
    us: string;
}

export interface Channel {
    channel_id: number;
    channel_name: string;
    channel_url: string;
    channel_logo: string;
}

export interface Category {
    category_id: number;
    category_name: string;
}
