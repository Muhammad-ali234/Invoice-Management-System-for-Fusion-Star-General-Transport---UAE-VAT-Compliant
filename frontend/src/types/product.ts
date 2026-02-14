export interface Product {
    id: number;
    user_id: number;
    category_id: number | null;
    unit_id: number | null;
    name: string;
    description: string | null;
    price: number;
    tax_percent: number;
    is_active: boolean;
    category_name?: string;
    unit_name?: string;
    unit_abbreviation?: string;
    created_at: string;
    updated_at: string;
}

export interface ProductCategory {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Unit {
    id: number;
    user_id: number;
    name: string;
    abbreviation: string | null;
    created_at: string;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    categoryId?: number;
    unitId?: number;
    taxPercent?: number;
    isActive?: boolean;
}
