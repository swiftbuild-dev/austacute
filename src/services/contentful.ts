/**
 * Contentful Data Fetching Functions
 *
 * This file contains all functions for fetching and transforming
 * Contentful content into the application's data structures.
 *
 * Updated for Contentful SDK v10+ with EntrySkeletonType pattern.
 */

import type { Entry, Asset } from 'contentful';
import {
    getContentfulClient,
    ContentfulError,
    handleContentfulError,
    extractImageUrls,
    getCachedData,
    setCachedData,
    withRetry,
} from '@/lib/contentful';
import type {
    CategorySkeleton,
    ProductSkeleton,
    ProductVariantSkeleton,
} from '@/lib/contentful';
import type { Product, ProductVariant, Category } from '@/types/shop';

/**
 * FETCH ALL PRODUCTS
 */
export const fetchAllProducts = async (): Promise<Product[]> => {
    const cacheKey = 'all-products';
    const cached = getCachedData<Product[]>(cacheKey);

    if (cached) {
        console.log('Returning cached products');
        return cached;
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();
            const response = await client.getEntries<ProductSkeleton>({
                content_type: 'product',
                limit: 100,
                include: 2,
                order: ['-sys.createdAt'],
            });

            return response.items.map((item) => transformProductEntry(item));
        });

        setCachedData(cacheKey, products);
        return products;
    } catch (error) {
        handleContentfulError(error, 'fetching all products');
    }
};

/**
 * FETCH FEATURED PRODUCTS
 */
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
    const cacheKey = 'featured-products';
    const cached = getCachedData<Product[]>(cacheKey);

    if (cached) {
        console.log('Returning cached featured products');
        return cached;
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();
            const response = await client.getEntries<ProductSkeleton>({
                content_type: 'product',
                'fields.featured': true,
                limit: 10,
                include: 2,
            });

            return response.items.map((item) => transformProductEntry(item));
        });

        setCachedData(cacheKey, products);
        return products;
    } catch (error) {
        handleContentfulError(error, 'fetching featured products');
    }
};

/**
 * FETCH PRODUCT BY SLUG
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
    if (!slug) {
        throw new ContentfulError('Product slug is required');
    }

    const cacheKey = `product-${slug}`;
    const cached = getCachedData<Product | null>(cacheKey);

    if (cached !== null) {
        console.log(`Returning cached product: ${slug}`);
        return cached;
    }

    try {
        const product = await withRetry(async () => {
            const client = getContentfulClient();
            const response = await client.getEntries<ProductSkeleton>({
                content_type: 'product',
                'fields.slug': slug,
                limit: 1,
                include: 2,
            });

            if (response.items.length === 0) {
                return null;
            }

            return transformProductEntry(response.items[0]);
        });

        setCachedData(cacheKey, product);
        return product;
    } catch (error) {
        handleContentfulError(error, `fetching product by slug: ${slug}`);
    }
};

/**
 * FETCH PRODUCT BY ID
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
    if (!id) {
        throw new ContentfulError('Product ID is required');
    }

    const cacheKey = `product-id-${id}`;
    const cached = getCachedData<Product | null>(cacheKey);

    if (cached !== null) {
        console.log(`Returning cached product: ${id}`);
        return cached;
    }

    try {
        const product = await withRetry(async () => {
            const client = getContentfulClient();
            const entry = await client.getEntry<ProductSkeleton>(id, { include: 2 });

            if (!entry) {
                return null;
            }

            return transformProductEntry(entry);
        });

        setCachedData(cacheKey, product);
        return product;
    } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
            console.log(`Product not found: ${id}`);
            return null;
        }
        handleContentfulError(error, `fetching product by ID: ${id}`);
    }
};

/**
 * FETCH PRODUCTS BY CATEGORY
 */
export const fetchProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    if (!categorySlug) {
        throw new ContentfulError('Category slug is required');
    }

    const cacheKey = `products-category-${categorySlug}`;
    const cached = getCachedData<Product[]>(cacheKey);

    if (cached) {
        console.log(`Returning cached products for category: ${categorySlug}`);
        return cached;
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();

            const categoryResponse = await client.getEntries<CategorySkeleton>({
                content_type: 'category',
                'fields.slug': categorySlug,
                limit: 1,
            });

            if (categoryResponse.items.length === 0) {
                console.warn(`Category not found: ${categorySlug}`);
                return [];
            }

            const categoryId = categoryResponse.items[0].sys.id;

            const response = await client.getEntries<ProductSkeleton>({
                content_type: 'product',
                'fields.category.sys.id': categoryId,
                limit: 100,
                include: 2,
            });

            return response.items.map((item) => transformProductEntry(item));
        });

        setCachedData(cacheKey, products);
        return products;
    } catch (error) {
        handleContentfulError(error, `fetching products by category: ${categorySlug}`);
    }
};

/**
 * FETCH ALL CATEGORIES
 */
export const fetchAllCategories = async (): Promise<Category[]> => {
    const cacheKey = 'all-categories';
    const cached = getCachedData<Category[]>(cacheKey);

    if (cached) {
        console.log('Returning cached categories');
        return cached;
    }

    try {
        const categories = await withRetry(async () => {
            const client = getContentfulClient();
            const response = await client.getEntries<CategorySkeleton>({
                content_type: 'category',
                limit: 50,
            });

            return response.items.map((item) => ({
                name: item.fields.name as string,
                slug: item.fields.slug as string,
                description: item.fields.description as string | undefined,
            }));
        });

        setCachedData(cacheKey, categories);
        return categories;
    } catch (error) {
        handleContentfulError(error, 'fetching all categories');
    }
};

/**
 * SEARCH PRODUCTS
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();
            const response = await client.getEntries<ProductSkeleton>({
                content_type: 'product',
                query: query.trim(),
                limit: 50,
                include: 2,
            });

            return response.items.map((item) => transformProductEntry(item));
        });

        return products;
    } catch (error) {
        handleContentfulError(error, `searching products with query: ${query}`);
    }
};

/**
 * TRANSFORMATION FUNCTIONS
 * Transform Contentful entries to application types
 */
export const transformProductEntry = (
    entry: Entry<ProductSkeleton, undefined, string>
): Product => {
    const fields = entry.fields;

    // Validate required fields
    if (!fields.name || !fields.slug || !fields.sku || fields.price === undefined) {
        throw new ContentfulError(
            `Invalid product entry ${entry.sys.id}: missing required fields`
        );
    }

    // Transform category reference to string
    let categoryName = 'uncategorized';
    if (fields.category && 'fields' in fields.category) {
        const categoryEntry = fields.category as Entry<CategorySkeleton, undefined, string>;
        categoryName = categoryEntry.fields.name as string;
    }

    // Transform variant references
    let variants: ProductVariant[] = [];
    if (fields.variants && Array.isArray(fields.variants)) {
        variants = fields.variants
            .filter(
                (v): v is Entry<ProductVariantSkeleton, undefined, string> =>
                    v !== null && typeof v === 'object' && 'fields' in v
            )
            .map((variantEntry) => ({
                name: variantEntry.fields.name as string,
                priceModifier: variantEntry.fields.priceModifier as number,
            }));
    }

    // Extract and optimize image URLs
    let images: string[] = [];
    if (fields.images && Array.isArray(fields.images)) {
        const resolvedImages = fields.images.filter(
            (img): img is Asset<undefined, string> =>
                img !== null && typeof img === 'object' && 'fields' in img
        );
        images = extractImageUrls(resolvedImages);
    }

    // Ensure at least one image
    if (images.length === 0) {
        console.warn(`Product ${entry.sys.id} has no images, using placeholder`);
        images.push('/placeholder-product.jpg');
    }

    // Transform to application Product type
    const product: Product = {
        id: entry.sys.id,
        name: fields.name as string,
        slug: fields.slug as string,
        sku: fields.sku as string,
        price: Math.round(fields.price as number),
        compareAtPrice: fields.compareAtPrice
            ? Math.round(fields.compareAtPrice as number)
            : undefined,
        shortDescription: fields.shortDescription as string,
        description: fields.description as string,
        images,
        category: categoryName,
        variants: variants.length > 0 ? variants : undefined,
        inStock: fields.inStock !== undefined ? (fields.inStock as boolean) : true,
        stockQuantity: fields.stockQuantity as number | undefined,
        featured: (fields.featured as boolean) || false,
        trustBadges: fields.trustBadges as string[] | undefined,
    };

    return product;
};

/**
 * BATCH OPERATIONS
 */
export const fetchProductsByIds = async (ids: string[]): Promise<Product[]> => {
    if (!ids || ids.length === 0) {
        return [];
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();

            const response = await client.getEntries<ProductSkeleton>({
                content_type: 'product',
                limit: 1000,
                include: 2,
            });

            return response.items
                .filter((item) => ids.includes(item.sys.id))
                .map((item) => transformProductEntry(item));
        });

        return products;
    } catch (error) {
        handleContentfulError(error, `fetching products by IDs: ${ids.join(', ')}`);
    }
};

/**
 * Get total product count
 */
export const getProductCount = async (): Promise<number> => {
    try {
        const client = getContentfulClient();
        const response = await client.getEntries<ProductSkeleton>({
            content_type: 'product',
            limit: 1,
            select: ['sys.id'],
        });

        return response.total;
    } catch (error) {
        handleContentfulError(error, 'fetching product count');
    }
};

/**
 * Verify Contentful connection
 */
export const verifyContentfulConnection = async (): Promise<boolean> => {
    try {
        const client = getContentfulClient();
        const space = await client.getSpace();
        console.log(`✓ Connected to Contentful space: ${space.name}`);
        return true;
    } catch (error) {
        console.error('✗ Failed to connect to Contentful:', error);
        return false;
    }
};
