export type PaginationQuery = {
    page?: number;
    limit?: number;
    keyword?: string;
};

export type LoginData = {
    username: string;
    password: string;
};

export type RestResponse = {
    status: 'success' | 'fail';
    data?: any;
    message?: string;
};

export type ImageFileType = {
    file?: any;
    url?: any;
    name?: string;
};

export type Spending = {
    _id: string;
    name: string;
    spending_type: string;
    spending_method: string;
    total: number;
    created_at: Date;
};

export type SpendingType = {
    _id: string;
    name: string;
    created_at: Date;
};

export type SpendingMethod = {
    _id: string;
    name: string;
    created_at: Date;
};

export type Photo = {
    id: string;
    url: string;
};

export type UserData = {
    _id: string;
    name: string;
    avatar?: Photo;
    email?: string;
    username: string;
    cv: string;
};
