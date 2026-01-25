/**
 * Contentful CMS Client Configuration
 *
 * This file sets up the Contentful client with proper TypeScript types
 * for Contentful SDK v10+ (EntrySkeletonType pattern).
 *
 * Environment variables required in .env.local:
 * - VITE_CONTENTFUL_SPACE_ID
 * - VITE_CONTENTFUL_ACCESS_TOKEN
 * - VITE_CONTENTFUL_PREVIEW_TOKEN (optional, for preview mode)
 */

import { createClient, EntryFieldTypes } from 'contentful';
import type { ContentfulClientApi, Asset, EntrySkeletonType } from 'contentful';

/**
 * TYPE DEFINITIONS FOR CONTENTFUL RESPONSES
 * Using EntrySkeletonType pattern required by Contentful SDK v10+
 */

// Category skeleton with contentTypeId
export type CategorySkeleton = EntrySkeletonType<
    {
        name: EntryFieldTypes.Text;
        slug: EntryFieldTypes.Text;
        description?: EntryFieldTypes.Text;
    },
    'category'
>;

// Product variant skeleton with contentTypeId
export type ProductVariantSkeleton = EntrySkeletonType<
    {
        name: EntryFieldTypes.Text;
        priceModifier: EntryFieldTypes.Integer;
    },
    'productVariant'
>;

// Product skeleton with contentTypeId
export type ProductSkeleton = EntrySkeletonType<
    {
        internalName: EntryFieldTypes.Text;
        name: EntryFieldTypes.Text;
        slug: EntryFieldTypes.Text;
        sku: EntryFieldTypes.Text;
        category: EntryFieldTypes.EntryLink<CategorySkeleton>;
        images: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
        shortDescription: EntryFieldTypes.Text;
        description: EntryFieldTypes.Text;
        price: EntryFieldTypes.Integer;
        compareAtPrice?: EntryFieldTypes.Integer;
        inStock: EntryFieldTypes.Boolean;
        stockQuantity?: EntryFieldTypes.Integer;
        variants?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ProductVariantSkeleton>>;
        trustBadges?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        featured?: EntryFieldTypes.Boolean;
    },
    'product'
>;

/**
 * Initialize the Contentful client
 * Using preview token if available for draft/unpublished content,
 * otherwise using the standard access token for published content
 */
const initializeContentfulClient = (): ContentfulClientApi<undefined> => {
    // Publishable Content Delivery API keys (safe to include in frontend)
    const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'z9ei2s7jmq34';
    const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '1D1JdXttqP3jIt6Xasfcs_IIFyHBOtpvfmuUliWmkgc';
    const previewToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN;

    if (!spaceId || !accessToken) {
        throw new Error(
            'Missing Contentful configuration. Please set VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN in .env.local'
        );
    }

    return createClient({
        space: spaceId,
        accessToken: previewToken || accessToken,
        host: previewToken ? 'preview.contentful.com' : 'cdn.contentful.com',
    });
};

// Create a singleton client instance
let contentfulClient: ContentfulClientApi<undefined> | null = null;

export const getContentfulClient = (): ContentfulClientApi<undefined> => {
    if (!contentfulClient) {
        contentfulClient = initializeContentfulClient();
    }
    return contentfulClient;
};

/**
 * ERROR HANDLING
 * Custom error class for Contentful-specific errors
 */
export class ContentfulError extends Error {
    constructor(
        public message: string,
        public statusCode?: number,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'ContentfulError';
    }
}

/**
 * UTILITY FUNCTIONS
 * Helper functions for data transformation
 */

/**
 * Transform a Contentful asset URL to include necessary query parameters
 * for optimization (width, height, format, quality)
 */
export const getOptimizedImageUrl = (
    assetUrl: string,
    width: number = 600,
    height: number = 600,
    quality: number = 80
): string => {
    if (!assetUrl) {
        return '';
    }

    // Handle relative URLs from Contentful
    const url = assetUrl.startsWith('http') ? assetUrl : `https:${assetUrl}`;

    const params = new URLSearchParams({
        w: width.toString(),
        h: height.toString(),
        fit: 'crop',
        q: quality.toString(),
    });

    return `${url}?${params.toString()}`;
};

/**
 * Extract image URLs from Contentful assets
 * Returns optimized URLs for both display and thumbnail
 * Updated for SDK v10+ Asset type
 */
export const extractImageUrls = (assets: Asset<undefined, string>[]): string[] => {
    if (!assets || assets.length === 0) {
        return [];
    }

    return assets
        .map((asset) => {
            const file = asset.fields.file;
            if (!file || typeof file.url !== 'string') {
                return '';
            }
            return getOptimizedImageUrl(file.url);
        })
        .filter((url): url is string => url !== '');
};

/**
 * Handle errors from Contentful API calls
 * Provides meaningful error messages and logging
 */
export const handleContentfulError = (error: unknown, context: string = ''): never => {
    console.error(`Contentful API Error ${context}:`, error);

    if (error instanceof Error) {
        throw new ContentfulError(
            `Failed to fetch from Contentful${context ? ` (${context})` : ''}: ${error.message}`,
            undefined,
            error
        );
    }

    throw new ContentfulError(
        `An unknown error occurred while fetching from Contentful${context ? ` (${context})` : ''}`,
        undefined,
        error
    );
};

/**
 * RETRY LOGIC
 * Implement exponential backoff for API calls in case of rate limiting
 */
export const withRetry = async <T,>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    initialDelayMs: number = 1000
): Promise<T> => {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on client errors (4xx)
            if (error instanceof Error && error.message.includes('4')) {
                throw error;
            }

            // Calculate exponential backoff delay
            if (attempt < maxAttempts - 1) {
                const delayMs = initialDelayMs * Math.pow(2, attempt);
                console.warn(
                    `Contentful API attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`
                );
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    }

    throw lastError;
};

/**
 * CACHE UTILITY
 * Simple in-memory cache to reduce API calls during development
 * In production, consider using a more robust caching solution
 */
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const getCachedData = <T,>(key: string): T | null => {
    const entry = cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
        return null;
    }

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION_MS;
    if (isExpired) {
        cache.delete(key);
        return null;
    }

    return entry.data;
};

export const setCachedData = <T,>(key: string, data: T): void => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
};

export const clearCache = (): void => {
    cache.clear();
};
