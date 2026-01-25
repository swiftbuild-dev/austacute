/**
 * Contentful CMS Client Configuration
 *
 * This file sets up the Contentful client with proper TypeScript types
 * and exports all necessary functions for fetching and transforming content.
 *
 * Environment variables required in .env.local:
 * - VITE_CONTENTFUL_SPACE_ID
 * - VITE_CONTENTFUL_ACCESS_TOKEN
 * - VITE_CONTENTFUL_PREVIEW_TOKEN (optional, for preview mode)
 */

import { createClient } from 'contentful';
import type { ContentfulClientApi, Asset, Entry } from 'contentful';

/**
 * Initialize the Contentful client
 * Using preview token if available for draft/unpublished content,
 * otherwise using the standard access token for published content
 */
const initializeContentfulClient = (): ContentfulClientApi => {
    const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
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
let contentfulClient: ContentfulClientApi | null = null;

export const getContentfulClient = (): ContentfulClientApi => {
    if (!contentfulClient) {
        contentfulClient = initializeContentfulClient();
    }
    return contentfulClient;
};

/**
 * TYPE DEFINITIONS FOR CONTENTFUL RESPONSES
 * These match the content model structure defined in Contentful
 */

export interface ContentfulCategory {
    sys: {
        id: string;
    };
    fields: {
        name: string;
        slug: string;
        description?: string;
    };
}

export interface ContentfulProductVariant {
    sys: {
        id: string;
    };
    fields: {
        name: string;
        priceModifier: number;
    };
}

export interface ContentfulProduct {
    sys: {
        id: string;
    };
    fields: {
        internalName: string;
        name: string;
        slug: string;
        sku: string;
        category: Entry<ContentfulCategory>;
        images: Asset[];
        shortDescription: string;
        description: string;
        price: number;
        compareAtPrice?: number;
        inStock: boolean;
        stockQuantity?: number;
        variants?: Entry<ContentfulProductVariant>[];
        trustBadges?: string[];
        featured?: boolean;
    };
}

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
 */
export const extractImageUrls = (assets: Asset[]): string[] => {
    if (!assets || assets.length === 0) {
        return [];
    }

    return assets.map((asset) => {
        if (!asset.fields.file?.url) {
            return '';
        }
        return getOptimizedImageUrl(asset.fields.file.url);
    });
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
