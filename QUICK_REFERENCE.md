# Contentful Integration Checklist

Quick reference guide for implementing Contentful integration in AustaCute Shop.

## ✅ Pre-Integration Setup

- [ ] Contentful space created at https://app.contentful.com
- [ ] Space ID: `z9ei2s7jmq34`
- [ ] Content Delivery API token: `1D1JdXttqP3jIt6Xasfcs_IIFyHBOtpvfmuUliWmkgc`
- [ ] Content model created with all required types:
  - [ ] Category content type
  - [ ] ProductVariant content type
  - [ ] Product content type
- [ ] At least 1-2 test products created and published in Contentful
- [ ] Product images uploaded to Contentful

## ✅ Files Created

These files have been created for you. No action needed unless you want to customize:

- [x] `src/lib/contentful.ts` - Client configuration and utilities
- [x] `src/services/contentful.ts` - Data fetching and transformation functions
- [x] `src/hooks/useContentful.ts` - React Query hooks for components
- [x] `.env.local.example` - Environment variables template
- [x] `INTEGRATION_GUIDE.md` - Comprehensive integration guide
- [x] `MIGRATION_EXAMPLE.md` - Example of updated Shop.tsx
- [x] `QUICK_REFERENCE.md` - This file

## ✅ Step 1: Configure Environment Variables

```bash
# 1. Copy the example file
cp .env.local.example .env.local

# 2. Edit .env.local and add your credentials
VITE_CONTENTFUL_SPACE_ID=z9ei2s7jmq34
VITE_CONTENTFUL_ACCESS_TOKEN=1D1JdXttqP3jIt6Xasfcs_IIFyHBOtpvfmuUliWmkgc

# 3. Add to .gitignore (keep .env.local secret!)
echo ".env.local" >> .gitignore
```

## ✅ Step 2: Verify Dependencies

All required packages are already installed:

```bash
# Check that contentful and @tanstack/react-query are in package.json
# They should be there already

# If not, install them:
bun install
```

## ✅ Step 3: Set Up QueryClient Provider

Update your main app file to include React Query provider:

**Option A: Using main.tsx**
```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

**Option B: Using App.tsx**
```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import YourRoutes from './routes'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourRoutes />
    </QueryClientProvider>
  )
}
```

## ✅ Step 4: Verify Connection (Optional but Recommended)

Add this to your App initialization to verify Contentful is connected:

```typescript
// src/App.tsx or src/main.tsx
import { verifyContentfulConnection } from '@/lib/contentful'

// Call during app initialization
verifyContentfulConnection().then(connected => {
  if (!connected) {
    console.warn('Contentful is not properly configured')
  }
})
```

## ✅ Step 5: Update Shop Page

Replace mock data with Contentful hook:

```typescript
// Before (src/pages/Shop.tsx)
import { products } from '@/data/mockProducts'

// After
import { useAllProducts } from '@/hooks/useContentful'

const Shop = () => {
  const { data: products = [], isLoading, error } = useAllProducts()
  
  // Handle loading and error states (see MIGRATION_EXAMPLE.md)
  
  // Rest of component stays the same!
}
```

## ✅ Step 6: Update Home Page Featured Products (Optional)

Update ShopPreview or featured section:

```typescript
// Before
import { getFeaturedProducts } from '@/data/mockProducts'
const featured = getFeaturedProducts()

// After
import { useFeaturedProducts } from '@/hooks/useContentful'
const { data: featured = [] } = useFeaturedProducts()
```

## ✅ Step 7: Test

```bash
# Start dev server
bun dev

# Check console for:
# ✓ "Connected to Contentful space: ..."
# ✓ Products loading and displaying
# ✓ No console errors
```

## 📋 Available Hooks

Use these in your components:

### Fetch All Products
```typescript
const { data: products = [] } = useAllProducts()
```

### Fetch Featured Products
```typescript
const { data: featured = [] } = useFeaturedProducts()
```

### Fetch Single Product by Slug
```typescript
const { data: product } = useProductBySlug('hydrating-glow-serum')
```

### Fetch Products by Category
```typescript
const { data: skincare = [] } = useProductsByCategory('skincare')
```

### All Categories
```typescript
const { data: categories = [] } = useAllCategories()
```

### Search Products
```typescript
const { data: results = [] } = useProductSearch('serum')
```

### Advanced Filters
```typescript
const { data: filtered = [] } = useProductsWithFilters({
  category: 'skincare',
  featured: true,
  inStock: true,
})
```

## 🔧 Common Tasks

### Handle Loading State
```typescript
const { data: products = [], isLoading } = useAllProducts()

if (isLoading) {
  return <LoadingSpinner />
}
```

### Handle Errors
```typescript
const { error } = useAllProducts()

if (error) {
  return <ErrorMessage message={error.message} />
}
```

### Force Refresh
```typescript
import { useQueryClient } from '@tanstack/react-query'

const MyComponent = () => {
  const queryClient = useQueryClient()
  
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['contentful', 'products'] })
  }
}
```

### Cache Configuration

Edit cache times in `src/hooks/useContentful.ts`:
```typescript
{
  staleTime: 5 * 60 * 1000,        // Fresh for 5 min
  gcTime: 10 * 60 * 1000,          // Keep for 10 min
}
```

## 🚀 Deployment

### Environment Variables
1. Add to your hosting platform:
   - `VITE_CONTENTFUL_SPACE_ID`
   - `VITE_CONTENTFUL_ACCESS_TOKEN`

2. For Vercel:
   - Go to Settings → Environment Variables
   - Add both variables
   - Choose "Automatic" for all environments

3. For other platforms, check their documentation

### Preview Mode (Optional)
To preview unpublished content:
1. Add `VITE_CONTENTFUL_PREVIEW_TOKEN` to environment
2. Client will automatically use preview API

## 🐛 Troubleshooting

### Issue: "products is not defined" error
**Fix:** Make sure you're using the hook to get products:
```typescript
const { data: products = [] } = useAllProducts() // ✓ Correct
// NOT: const products = ... // ✗ Wrong
```

### Issue: Products showing but images broken
**Fix:** 
1. Check images are published in Contentful
2. Verify asset URLs are public
3. Check for CORS errors in console

### Issue: Products not updating after edit in Contentful
**Fix:**
1. Default cache is 5 minutes (then refreshes)
2. Force refresh:
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['contentful'] })
   ```
3. For live updates, use preview token

### Issue: "401 Unauthorized" error
**Fix:**
1. Check Space ID is correct
2. Check API token is correct
3. Verify API key has "Content Delivery API" access
4. Restart dev server after changing .env.local

### Issue: QueryClient errors
**Fix:**
1. Make sure QueryClientProvider wraps your app (Step 3)
2. Install if missing: `bun install @tanstack/react-query`

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/lib/contentful.ts` | Client config, types, utilities |
| `src/services/contentful.ts` | Data fetching & transformation |
| `src/hooks/useContentful.ts` | React Query hooks |
| `.env.local` | Your credentials (never commit!) |
| `INTEGRATION_GUIDE.md` | Full detailed guide |
| `MIGRATION_EXAMPLE.md` | Example Shop.tsx |

## 📖 Resources

- **Contentful API:** https://www.contentful.com/developers/
- **React Query:** https://tanstack.com/query/latest
- **TypeScript:** https://www.typescriptlang.org/docs/

## ✨ Next Steps After Integration

1. Ensure all products in Contentful are published
2. Test filtering and search
3. Set up product images properly
4. Configure cache times for your traffic
5. Monitor Contentful API usage
6. Set up error monitoring (Sentry, LogRocket, etc.)
7. Consider image optimization service (Cloudinary, imgix)
8. Plan content migration strategy

## 📊 Content Model Recap

Your Contentful content model structure:

```
Category
├── name (Text)
├── slug (Text, Unique)
└── description (Text, Optional)

ProductVariant
├── name (Text)
└── priceModifier (Number)

Product
├── internalName (Text)
├── name (Text)
├── slug (Text, Unique)
├── sku (Text, Unique)
├── category → Category (Reference)
├── images → [Assets] (Min 1)
├── shortDescription (Text)
├── description (Text)
├── price (Number)
├── compareAtPrice (Number, Optional)
├── inStock (Boolean, Default: true)
├── stockQuantity (Number, Optional)
├── variants → [ProductVariant] (Optional)
├── trustBadges (Text[])
└── featured (Boolean, Optional)
```

## ✅ Implementation Checklist

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Add credentials to `.env.local`
- [ ] Add `.env.local` to `.gitignore`
- [ ] Set up QueryClientProvider (Step 3)
- [ ] Update Shop.tsx to use `useAllProducts()` hook
- [ ] Test loading state
- [ ] Test error handling
- [ ] Test product display
- [ ] Test product click/modal
- [ ] Deploy with environment variables
- [ ] Verify in production

---

**Ready to go!** Start with Step 1 above and follow in order. If you get stuck, check `INTEGRATION_GUIDE.md` or the troubleshooting section.
