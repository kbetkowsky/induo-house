export interface Property {
    id: number;
title: string;
description: string;
price: number;
address: string;
city: string;
area: number;
rooms: number;
bathrooms?: number;
imageUrl?: string;
status?: string;
createdAt: string;
updatedAt?: string;
owner: PropertyOwner;
}

export interface PropertyOwner {
id: number;
username: string;
email: string;
}

export interface CreatePropertyRequest {
title: string;
description: string;
price: number;
address: string;
city: string;
area: number;
rooms: number;
bathrooms?: number;
}

export interface UpdatePropertyRequest {
title?: string;
description?: string;
price?: number;
address?: string;
city?: string;
area?: number;
rooms?: number;
bathrooms?: number;
}

export interface LoginRequest {
username: string;
password: string;
}

export interface LoginResponse {
token: string;
username: string;
email: string;
}