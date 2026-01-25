/**
 * Contentful Data Fetching Functions
 *
 * This file contains all functions for fetching and transforming
 * Contentful content into the application's data structures.
 *
 * Key responsibilities:
 * - Fetch products, categories, and variants from Contentful
 * - Transform Contentful responses to match application types
 * - Handle relationships and references
 * - Provide filtering and search capabilities
 * - Implement error handling and caching
 */

import type { Entry } from 'contentful';
import {
    getContentfulClient,
    ContentfulError,
    handleContentfulError,
    extractImageUrls,
    getCachedData,
    setCachedData,
    withRetry,
} from '@/lib/contentful';
import type { ContentfulCategory, ContentfulProduct, ContentfulProductVariant } from '@/lib/contentful';
import type { Product, ProductVariant, Category } from '@/types/shop';

/**
 * FETCH ALL PRODUCTS
 *
 * Fetches all published products from Contentful with their:
 * - Category references (resolved)
 * - Product variant references (resolved)
 * - Optimized image URLs
 *
 * Implements caching to reduce API calls
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
            const response = await client.getEntries<ContentfulProduct>({
                content_type: 'product',
                limit: 100,
                include: 2, // Include up to 2 levels of references (category, variants)
                order: '-sys.createdAt', // Most recently created first
            });

            return response.items.map((item) => transformProductEntry(item));
        });

        // Cache the results
        setCachedData(cacheKey, products);

        return products;
    } catch (error) {
        handleContentfulError(error, 'fetching all products');
    }
};

/**
 * FETCH FEATURED PRODUCTS
 *
 * Fetches only products marked as featured in Contentful
 * Useful for home page hero section and featured section
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
            const response = await client.getEntries<ContentfulProduct>({
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
 *
 * Fetches a single product by its slug (URL-friendly identifier)
 * Used for individual product pages/modals
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
            const response = await client.getEntries<ContentfulProduct>({
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
 *
 * Fetches a single product by its Contentful system ID
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
            const entry = await client.getEntry<ContentfulProduct>(id);

            if (!entry) {
                return null;
            }

            return transformProductEntry(entry);
        });

        setCachedData(cacheKey, product);

        return product;
    } catch (error) {
        // 404 errors are expected when product doesn't exist
        if (error instanceof Error && error.message.includes('404')) {
            console.log(`Product not found: ${id}`);
            return null;
        }
        handleContentfulError(error, `fetching product by ID: ${id}`);
    }
};

/**
 * FETCH PRODUCTS BY CATEGORY
 *
 * Fetches all products that belong to a specific category
 * Category can be identified by slug or ID
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

            // First, find the category by slug
            const categoryResponse = await client.getEntries<ContentfulCategory>({
                content_type: 'category',
                'fields.slug': categorySlug,
                limit: 1,
            });

            if (categoryResponse.items.length === 0) {
                console.warn(`Category not found: ${categorySlug}`);
                return [];
            }

            const categoryId = categoryResponse.items[0].sys.id;

            // Then fetch products in that category
            const response = await client.getEntries<ContentfulProduct>({
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
 *
 * Fetches all available product categories
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
            const response = await client.getEntries<ContentfulCategory>({
                content_type: 'category',
                limit: 50,
                order: 'fields.name',
            });

            return response.items.map((item) => ({
                name: item.fields.name,
                slug: item.fields.slug,
                description: item.fields.description,
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
 *
 * Full-text search across product names and descriptions
 * Uses Contentful's search capability
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();
            const response = await client.getEntries<ContentfulProduct>({
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
 *
 * These functions convert Contentful responses to application types
 */

/**
 * Transform a single product entry from Contentful
 * Handles all field mappings and relationship transformations
 */
export const transformProductEntry = (entry: Entry<ContentfulProduct>): Product => {
    const fields = entry.fields;

    // Validate required fields
    if (!fields.name || !fields.slug || !fields.sku || !fields.price) {
        throw new ContentfulError(
            `Invalid product entry ${entry.sys.id}: missing required fields`
        );
    }

    // Transform category reference to string
    let categoryName = 'uncategorized';
    if (fields.category) {
        const categoryEntry = fields.category as Entry<ContentfulCategory>;
        categoryName = categoryEntry.fields.name;
    }

    // Transform variant references
    let variants: ProductVariant[] = [];
    if (fields.variants && Array.isArray(fields.variants)) {
        variants = (fields.variants as Entry<ContentfulProductVariant>[]).map((variantEntry) => ({
            name: variantEntry.fields.name,
            priceModifier: variantEntry.fields.priceModifier,
        }));
    }

    // Extract and optimize image URLs
    const images = extractImageUrls(fields.images || []);

    // Ensure at least one image
    if (images.length === 0) {
        console.warn(
            `Product ${entry.sys.id} has no images, using placeholder`
        );
        images.push('/placeholder-product.jpg');
    }

    // Transform to application Product type
    const product: Product = {
        id: entry.sys.id,
        name: fields.name,
        slug: fields.slug,
        sku: fields.sku,
        price: Math.round(fields.price), // Ensure integer
        compareAtPrice: fields.compareAtPrice
            ? Math.round(fields.compareAtPrice)
            : undefined,
        shortDescription: fields.shortDescription,
        description: fields.description,
        images,
        category: categoryName,
        variants: variants.length > 0 ? variants : undefined,
        inStock: fields.inStock !== undefined ? fields.inStock : true,
        stockQuantity: fields.stockQuantity,
        featured: fields.featured || false,
        trustBadges: fields.trustBadges,
    };

    return product;
};

/**
 * BATCH OPERATIONS
 *
 * Efficient bulk fetching operations
 */

/**
 * Fetch multiple products by their IDs
 * More efficient than individual fetches if you have specific IDs
 */
export const fetchProductsByIds = async (ids: string[]): Promise<Product[]> => {
    if (!ids || ids.length === 0) {
        return [];
    }

    try {
        const products = await withRetry(async () => {
            const client = getContentfulClient();

            // Fetch all products at once and filter by IDs
            // Contentful doesn't support OR queries directly in sys.id,
            // so we fetch and filter client-side
            const response = await client.getEntries<ContentfulProduct>({
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
 * EXPORT HELPERS FOR TESTING/DEBUGGING
 *
 * These help during development and testing
 */

/**
 * Get total product count (useful for pagination)
 */
export const getProductCount = async (): Promise<number> => {
    try {
        const client = getContentfulClient();
        const response = await client.getEntries<ContentfulProduct>({
            content_type: 'product',
            limit: 1,
            select: ['sys.id'], // Minimal query for count
        });

        return response.total;
    } catch (error) {
        handleContentfulError(error, 'fetching product count');
    }
};

/**
 * Verify Contentful connection and credentials
 * Call this during app initialization to catch configuration issues early
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
