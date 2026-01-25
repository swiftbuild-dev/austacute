# Contentful CMS Integration Guide

Complete step-by-step guide to integrate Contentful with your AustaCute Shop codebase.

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Architecture & Data Flow](#architecture--data-flow)
4. [Component Integration](#component-integration)
5. [Page Integration](#page-integration)
6. [Fetching Strategies](#fetching-strategies)
7. [Error Handling](#error-handling)
8. [Caching & Performance](#caching--performance)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This integration connects your React/Vite application to Contentful CMS, allowing you to:
- Manage product catalog from Contentful
- Organize products by categories
- Manage product variants and pricing
- Handle product images and media
- Filter products by featured status or availability

### Key Files Created

```
src/
├── lib/
│   └── contentful.ts              # Contentful client & utilities
├── services/
│   └── contentful.ts              # Data fetching functions
└── hooks/
    └── useContentful.ts           # React Query hooks

.env.local.example                 # Environment variables template
INTEGRATION_GUIDE.md              # This file
```

---

## Setup Instructions

### Step 1: Create Environment Variables File

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Contentful credentials:
   ```env
   VITE_CONTENTFUL_SPACE_ID=z9ei2s7jmq34
   VITE_CONTENTFUL_ACCESS_TOKEN=1D1JdXttqP3jIt6Xasfcs_IIFyHBOtpvfmuUliWmkgc
   # VITE_CONTENTFUL_PREVIEW_TOKEN= (optional)
   ```

3. Add `.env.local` to `.gitignore` if not already there:
   ```
   .env.local
   .env.*.local
   ```

### Step 2: Verify Installation

The Contentful SDK is already installed (`contentful@^11.10.2` in package.json).
React Query is also installed (`@tanstack/react-query@^5.83.0`).

If you need to reinstall dependencies:
```bash
bun install
```

### Step 3: Verify Connection

Test your connection in your app's main initialization:

```typescript
// src/App.tsx or src/main.tsx
import { verifyContentfulConnection } from '@/lib/contentful';

// Call early in your app setup
await verifyContentfulConnection();
```

---

## Architecture & Data Flow

### Data Fetching Stack

```
React Component
      ↓
Custom Hook (useContentful.ts)
      ↓
React Query (TanStack Query)
      ↓
Contentful Service (services/contentful.ts)
      ↓
Contentful Client (lib/contentful.ts)
      ↓
Contentful CDN API
```

### How It Works

1. **React Components** call custom hooks (e.g., `useAllProducts()`)
2. **Custom Hooks** use React Query for caching and state management
3. **Contentful Service** transforms Contentful responses to app types
4. **Contentful Client** handles API communication and error handling

### Benefits of This Architecture

- ✅ Type-safe throughout the stack
- ✅ Automatic caching with React Query
- ✅ Background refetching capabilities
- ✅ Error boundaries and error handling
- ✅ Easy to test and extend
- ✅ Minimal changes to existing components

---

## Component Integration

### Updating ProductCard.tsx

The ProductCard component already expects the correct Product type. No changes needed!

### Updating ProductModal.tsx

The ProductModal component already expects the correct Product type. No changes needed!

### Updating Shop.tsx

Replace the mock data import with Contentful hooks:

#### Before:
```typescript
import { products } from '@/data/mockProducts';

const Shop = () => {
    // ...rest of component
    return (
        <div>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={...} />
            ))}
        </div>
    );
};
```

#### After:
```typescript
import { useAllProducts } from '@/hooks/useContentful';

const Shop = () => {
    const { data: products = [], isLoading, error } = useAllProducts();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={...} />
            ))}
        </div>
    );
};
```

### Updating Services/ShopPreview.tsx

Replace with:
```typescript
import { useFeaturedProducts } from '@/hooks/useContentful';

export const ShopPreview = () => {
    const { data: products = [], isLoading } = useFeaturedProducts();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="grid gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={...} />
            ))}
        </div>
    );
};
```

---

## Page Integration

### Shop Page (Full Implementation)

```typescript
// src/pages/Shop.tsx
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Shield, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { useAllProducts } from '@/hooks/useContentful';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductModal } from '@/components/shop/ProductModal';
import { Product } from '@/types/shop';
import { WHATSAPP_NUMBER } from '@/data/mockProducts';

const Shop = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });

    // Fetch products from Contentful
    const { data: products = [], isLoading, error } = useAllProducts();

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const trustFeatures = [
        {
            icon: Shield,
            title: '100% Authentic',
            description: 'All products are genuine and sourced directly from trusted suppliers',
        },
        // ... rest of features
    ];

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading products...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto py-12">
                    <div className="text-center text-destructive">
                        <p className="font-semibold">Failed to load products</p>
                        <p className="text-sm mt-2">{error.message}</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Rest of your existing Shop page JSX */}
            <section className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Shop</h1>
                {products.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        <p>No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </section>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

            <Footer />
        </main>
    );
};

export default Shop;
```

---

## Fetching Strategies

### Strategy 1: Static Generation (Recommended for E-Commerce)

For optimal performance and SEO, generate static pages at build time:

```typescript
// src/lib/staticGeneration.ts
import {
    fetchAllProducts,
    fetchFeaturedProducts,
    fetchAllCategories,
} from '@/services/contentful';

// Call these during build time
export async function generateStaticProps() {
    try {
        const [products, categories, featured] = await Promise.all([
            fetchAllProducts(),
            fetchAllCategories(),
            fetchFeaturedProducts(),
        ]);

        return {
            props: {
                products,
                categories,
                featured,
            },
            revalidate: 3600, // Regenerate every hour (ISR)
        };
    } catch (error) {
        console.error('Failed to generate static content:', error);
        return {
            notFound: true,
            revalidate: 60, // Retry in 1 minute on error
        };
    }
}
```

### Strategy 2: Client-Side Fetching (Current Approach)

Products are fetched when components mount:
- Best for: User interactions, real-time filtering
- Cache time: 5 minutes (configurable in hooks)
- Perfect for your current Vite + React setup

### Strategy 3: Hybrid Approach

Mix static and dynamic content:

```typescript
// Static shell with dynamic updates
const Shop = ({ initialProducts }: Props) => {
    const { data: freshProducts = initialProducts } = useAllProducts();
    // Show initial products immediately, then update with fresh data
};
```

---

## Error Handling

### Component-Level Error Handling

```typescript
import { useAllProducts } from '@/hooks/useContentful';

const MyComponent = () => {
    const { data, isLoading, error } = useAllProducts();

    if (error) {
        return (
            <div className="alert alert-destructive">
                <AlertCircle className="h-4 w-4" />
                <div>
                    <h3>Unable to load products</h3>
                    <p className="text-sm">{error.message}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return <div>{/* render data */}</div>;
};
```

### Error Boundary

Wrap your app with an error boundary to catch unexpected errors:

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="alert alert-destructive">
                    <p>Something went wrong loading content</p>
                </div>
            );
        }

        return this.props.children;
    }
}
```

---

## Caching & Performance

### Cache Configuration

Caching is automatically handled by React Query. Configuration in `useContentful.ts`:

```typescript
{
    staleTime: 5 * 60 * 1000,        // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000,          // Keep data in memory for 10 minutes
    retry: 2,                        // Retry failed requests 2 times
    retryDelay: exponentialBackoff,  // Increase delay between retries
}
```

### Manual Cache Invalidation

Force a refresh when needed:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const MyComponent = () => {
    const queryClient = useQueryClient();

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['contentful', 'products'] });
    };

    return <button onClick={handleRefresh}>Refresh Products</button>;
};
```

### Cache Keys

Use consistent cache keys to avoid bugs:

```typescript
// Good: Centralized in contentfulKeys object
const contentfulKeys = {
    products: ['contentful', 'products'],
    productBySlug: (slug) => ['contentful', 'product-slug', slug],
};

// Also invalidate by prefix
queryClient.invalidateQueries({
    queryKey: ['contentful', 'products'],
});
```

---

## Migrating from Mock Data

### Phase 1: Keep Mock Data (Current State)
- Both mock data and Contentful available
- Contentful data shows in separate section
- No breaking changes

### Phase 2: Parallel Usage
- Replace main shop page with Contentful
- Keep mock data for fallback
- Test with real Contentful content

### Phase 3: Full Migration
- Remove mock data from production
- Use Contentful exclusively
- Archive mock data for reference

### Example Migration Code

```typescript
// Phase 1 & 2: Fall back to mock data if Contentful fails
const useFallbackProducts = () => {
    const { data, error } = useAllProducts();
    
    if (error) {
        console.warn('Contentful failed, using mock data');
        return { data: mockProducts, error: null };
    }
    
    return { data: data || mockProducts, error };
};

// Phase 3: Use only Contentful (remove fallback)
const useProducts = () => useAllProducts();
```

---

## Additional Features

### Filtering by Category

```typescript
import { useProductsByCategory } from '@/hooks/useContentful';

const CategoryPage = ({ slug }: { slug: string }) => {
    const { data: products = [] } = useProductsByCategory(slug);
    
    return (
        <div className="grid grid-cols-3 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
    );
};
```

### Product Search

```typescript
import { useProductSearch } from '@/hooks/useContentful';

const SearchResults = ({ query }: { query: string }) => {
    const { data: results = [] } = useProductSearch(query);
    
    return <div>{/* render results */}</div>;
};
```

### Featured Products Only

```typescript
import { useFeaturedProducts } from '@/hooks/useContentful';

const Featured = () => {
    const { data = [] } = useFeaturedProducts();
    return <div>{/* render featured */}</div>;
};
```

### Advanced Filtering

```typescript
import { useProductsWithFilters } from '@/hooks/useContentful';

const AdvancedFilter = () => {
    const { data = [] } = useProductsWithFilters({
        category: 'skincare',
        featured: true,
        inStock: true,
    });
    
    return <div>{/* render filtered */}</div>;
};
```

---

## Performance Optimization

### Image Optimization

Images are automatically optimized in `lib/contentful.ts`:

```typescript
// Automatic URL parameters added:
// - w=600 (width)
// - h=600 (height)
// - fit=crop (aspect ratio)
// - q=80 (quality)

// For different sizes:
const smallImage = getOptimizedImageUrl(url, 300, 300, 80);
const largeImage = getOptimizedImageUrl(url, 1200, 1200, 90);
```

### Lazy Loading

Already implemented in ProductCard:

```typescript
<img
    src={product.images[0]}
    alt={product.name}
    loading="lazy"  // Native browser lazy loading
    className="transition-transform duration-700"
/>
```

### Pagination (If Needed)

For large product catalogs, add pagination:

```typescript
const limit = 20;
const offset = (page - 1) * limit;

const response = await client.getEntries({
    content_type: 'product',
    limit,
    skip: offset,
});
```

---

## TypeScript Types

Your existing Product interface already matches Contentful:

```typescript
// src/types/shop.ts
export interface Product {
    id: string;              // from sys.id
    name: string;
    slug: string;
    sku: string;
    price: number;           // in Naira
    compareAtPrice?: number;
    shortDescription: string;
    description: string;
    images: string[];        // optimized URLs
    category: string;        // category name
    variants?: ProductVariant[];
    inStock: boolean;
    stockQuantity?: number;
    featured?: boolean;
    trustBadges?: string[];
}

export interface ProductVariant {
    name: string;
    priceModifier: number;
}

export interface Category {
    name: string;
    slug: string;
    description?: string;
}
```

---

## Troubleshooting

### Issue: "Environment variables not loading"

**Solution:**
- Restart dev server after creating `.env.local`
- Variables must start with `VITE_` for client exposure
- Check `.env.local` is in project root, not in src/

### Issue: "Can't find module 'contentful'"

**Solution:**
```bash
bun install
bun install --save-exact contentful@11.10.2
```

### Issue: "Products showing but images broken"

**Solution:**
- Check that images are published in Contentful
- Verify Asset URLs are accessible
- Look for CORS errors in console
- Try accessing the asset URL directly in browser

### Issue: "Products not updating after edit in Contentful"

**Solution:**
- Cache invalidation happens automatically every 5 minutes
- Force refresh with: `queryClient.invalidateQueries()`
- Check that entries are published, not just in draft
- For live updates, use preview token and enable preview mode

### Issue: "401 Unauthorized errors"

**Solution:**
- Verify Space ID matches your Contentful space
- Check API key is correct
- Ensure API key has access to content types
- Verify you're using Content Delivery API (not Management)

---

## Next Steps

1. ✅ Create `.env.local` with your credentials
2. ✅ Create products in Contentful (if not already done)
3. ✅ Update Shop.tsx to use `useAllProducts()` hook
4. ✅ Test in development server
5. ✅ Deploy with environment variables set
6. ✅ Monitor Contentful quota and performance
7. ✅ Set up automated backups in Contentful

---

## Support & Resources

- **Contentful Docs:** https://www.contentful.com/developers/
- **React Query Docs:** https://tanstack.com/query/latest
- **TypeScript Guide:** https://www.typescriptlang.org/docs/

---

**Last Updated:** January 25, 2026
