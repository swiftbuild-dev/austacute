/**
 * Custom React Hooks for Contentful Data Fetching
 *
 * These hooks provide a convenient way to fetch and cache
 * Contentful data throughout your React components.
 *
 * All hooks use React Query (TanStack Query) for:
 * - Caching
 * - Automatic refetching
 * - Background updates
 * - Stale data handling
 * - Error boundary support
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Product, Category } from '@/types/shop';
import {
    fetchAllProducts,
    fetchFeaturedProducts,
    fetchProductBySlug,
    fetchProductById,
    fetchProductsByCategory,
    fetchAllCategories,
    searchProducts,
} from '@/services/contentful';
import { ContentfulError } from '@/lib/contentful';

/**
 * Query key factory for consistent cache management
 * Prevents accidental cache misses due to key inconsistencies
 */
const contentfulKeys = {
    all: ['contentful'] as const,
    products: ['contentful', 'products'] as const,
    product: (id: string | undefined) => ['contentful', 'product', id] as const,
    productBySlug: (slug: string | undefined) => ['contentful', 'product-slug', slug] as const,
    productsByCategory: (categorySlug: string | undefined) =>
        ['contentful', 'products-category', categorySlug] as const,
    featured: ['contentful', 'featured-products'] as const,
    categories: ['contentful', 'categories'] as const,
    search: (query: string) => ['contentful', 'search', query] as const,
};

/**
 * HOOK: useAllProducts
 *
 * Fetches all products from Contentful
 * Use this for the main shop/catalog page
 *
 * @example
 * const { data: products, isLoading, error } = useAllProducts();
 */
export const useAllProducts = (): UseQueryResult<Product[], ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.products,
        queryFn: fetchAllProducts,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * HOOK: useFeaturedProducts
 *
 * Fetches only featured products from Contentful
 * Use this for the hero/featured section on home page
 *
 * @example
 * const { data: featuredProducts, isLoading } = useFeaturedProducts();
 */
export const useFeaturedProducts = (): UseQueryResult<Product[], ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.featured,
        queryFn: fetchFeaturedProducts,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
};

/**
 * HOOK: useProductBySlug
 *
 * Fetches a single product by its slug
 * Use this for individual product pages/modals
 *
 * @param slug - The product slug (URL-friendly identifier)
 * @returns Product data, loading state, and error
 *
 * @example
 * const { data: product, isLoading, error } = useProductBySlug('hydrating-glow-serum');
 */
export const useProductBySlug = (
    slug: string | undefined
): UseQueryResult<Product | null, ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.productBySlug(slug),
        queryFn: () => (slug ? fetchProductBySlug(slug) : Promise.resolve(null)),
        enabled: !!slug, // Only run query if slug is provided
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
    });
};

/**
 * HOOK: useProductById
 *
 * Fetches a single product by its Contentful ID
 *
 * @param id - The product's Contentful system ID
 * @returns Product data, loading state, and error
 *
 * @example
 * const { data: product } = useProductById('7a9eEj5vS4m5K1X2');
 */
export const useProductById = (
    id: string | undefined
): UseQueryResult<Product | null, ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.product(id),
        queryFn: () => (id ? fetchProductById(id) : Promise.resolve(null)),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
    });
};

/**
 * HOOK: useProductsByCategory
 *
 * Fetches all products in a specific category
 * Use this for category filter pages
 *
 * @param categorySlug - The category slug
 * @returns Array of products in that category
 *
 * @example
 * const { data: skincare, isLoading } = useProductsByCategory('skincare');
 */
export const useProductsByCategory = (
    categorySlug: string | undefined
): UseQueryResult<Product[], ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.productsByCategory(categorySlug),
        queryFn: () =>
            categorySlug ? fetchProductsByCategory(categorySlug) : Promise.resolve([]),
        enabled: !!categorySlug,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
};

/**
 * HOOK: useAllCategories
 *
 * Fetches all available product categories
 * Use this for navigation menus and category filters
 *
 * @example
 * const { data: categories } = useAllCategories();
 */
export const useAllCategories = (): UseQueryResult<Category[], ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.categories,
        queryFn: fetchAllCategories,
        staleTime: 15 * 60 * 1000, // 15 minutes - categories change less frequently
        gcTime: 30 * 60 * 1000,
        retry: 2,
    });
};

/**
 * HOOK: useProductSearch
 *
 * Performs a full-text search across products
 * Use this for search functionality
 *
 * @param query - The search query string
 * @returns Array of matching products
 *
 * @example
 * const { data: results } = useProductSearch('serum');
 */
export const useProductSearch = (
    query: string | undefined
): UseQueryResult<Product[], ContentfulError> => {
    return useQuery({
        queryKey: contentfulKeys.search(query || ''),
        queryFn: () =>
            query && query.trim().length > 0
                ? searchProducts(query)
                : Promise.resolve([]),
        enabled: !!query && query.trim().length > 0,
        staleTime: 3 * 60 * 1000, // 3 minutes - search results may change more frequently
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
};

/**
 * HOOK: useProductsWithFilters
 *
 * Advanced hook that combines multiple filtering options
 * Useful for complex product listing pages
 *
 * @param options - Filter options
 * @returns Array of products matching all filters
 *
 * @example
 * const { data: filteredProducts } = useProductsWithFilters({
 *   category: 'skincare',
 *   inStock: true,
 *   featured: false,
 * });
 */
export interface ProductFilterOptions {
    category?: string;
    featured?: boolean;
    inStock?: boolean;
    search?: string;
}

export const useProductsWithFilters = (
    options: ProductFilterOptions
): UseQueryResult<Product[], ContentfulError> => {
    // Determine which fetcher to use based on options
    let fetcher: () => Promise<Product[]>;

    if (options.search) {
        fetcher = () => searchProducts(options.search!);
    } else if (options.category) {
        fetcher = () => fetchProductsByCategory(options.category!);
    } else {
        fetcher = fetchAllProducts;
    }

    return useQuery({
        queryKey: [
            'contentful',
            'products-filtered',
            options.category,
            options.featured,
            options.inStock,
            options.search,
        ],
        queryFn: async () => {
            const products = await fetcher();

            // Apply client-side filters
            return products.filter((product) => {
                if (options.featured !== undefined && product.featured !== options.featured) {
                    return false;
                }
                if (options.inStock !== undefined && product.inStock !== options.inStock) {
                    return false;
                }
                return true;
            });
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
};

/**
 * UTILITY HOOKS
 */

/**
 * HOOK: useProductLoadingState
 *
 * Helper hook to manage loading states from multiple queries
 *
 * @example
 * const isLoading = useProductLoadingState(productsQuery, categoriesQuery);
 */
export const useProductLoadingState = (...queries: UseQueryResult<unknown, unknown>[]): boolean => {
    return queries.some((query) => query.isLoading);
};

/**
 * HOOK: useProductErrorState
 *
 * Helper hook to collect errors from multiple queries
 *
 * @example
 * const errors = useProductErrorState(productsQuery, categoriesQuery);
 */
export const useProductErrorState = (...queries: UseQueryResult<unknown, unknown>[]): Error | null => {
    const error = queries.find((query) => query.error)?.error;
    return error || null;
};
