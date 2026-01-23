// Shop-related TypeScript types

export interface ProductVariant {
    name: string;
    priceModifier: number; // Amount to add/subtract from base price
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number; // Base price in Naira
    compareAtPrice?: number; // Original price for showing discounts
    shortDescription: string;
    description: string;
    images: string[]; // 1-2 image URLs
    category: string;
    variants?: ProductVariant[];
    inStock: boolean;
    stockQuantity?: number;
    featured?: boolean;
    trustBadges?: string[];
}

export interface Category {
    name: string;
    slug: string;
    description?: string;
}

// Helper type for the order message
export interface OrderDetails {
    product: Product;
    selectedVariant?: ProductVariant;
    quantity: number;
}
