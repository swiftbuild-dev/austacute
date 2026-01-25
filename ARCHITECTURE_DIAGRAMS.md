# Architecture & Data Flow Diagrams

## 1. Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your React Application                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Shop Page   │  │ Category    │  │ Product     │            │
│  │ (Shop.tsx)  │  │ Page        │  │ Modal       │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│          ┌────────────────▼───────────────────┐                │
│          │    Custom Hooks (useContentful)    │                │
│          │  - useAllProducts()                │                │
│          │  - useFeaturedProducts()           │                │
│          │  - useProductBySlug()              │                │
│          │  - useProductsByCategory()         │                │
│          │  - useAllCategories()              │                │
│          │  - useProductSearch()              │                │
│          │  - useProductsWithFilters()        │                │
│          └────────────────┬────────────────────┘               │
│                           │                                     │
│          ┌────────────────▼───────────────────────┐            │
│          │       React Query (TanStack)          │            │
│          │  - Automatic Caching (5 min)          │            │
│          │  - Automatic Retries (2x)             │            │
│          │  - Background Refetching              │            │
│          │  - Stale-While-Revalidate            │            │
│          └────────────────┬────────────────────────┘           │
│                           │                                    │
│          ┌────────────────▼──────────────────────┐             │
│          │  Contentful Service (contentful.ts)   │             │
│          │  - fetchAllProducts()                 │             │
│          │  - fetchFeaturedProducts()            │             │
│          │  - fetchProductBySlug()               │             │
│          │  - fetchProductsByCategory()          │             │
│          │  - fetchAllCategories()               │             │
│          │  - searchProducts()                   │             │
│          │  - Data Transformation                │             │
│          │  - Error Handling                     │             │
│          │  - Image URL Optimization             │             │
│          └────────────────┬──────────────────────┘             │
│                           │                                    │
│          ┌────────────────▼──────────────────────┐             │
│          │  Contentful Client (lib/contentful.ts)│             │
│          │  - Client Initialization              │             │
│          │  - Environment Variables              │             │
│          │  - TypeScript Types                   │             │
│          │  - Retry Logic                        │             │
│          │  - Caching Utilities                  │             │
│          │  - Error Handling                     │             │
│          └────────────────┬──────────────────────┘             │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼ HTTPS
                ┌──────────────────────────┐
                │  Contentful CDN API      │
                │  - cdn.contentful.com    │
                │  (or preview if enabled) │
                └──────────────────────────┘
```

---

## 2. Data Flow: Product Fetching

```
User visits Shop page
         │
         ▼
React component mounts
         │
         ▼
useAllProducts() hook called
         │
         ▼
React Query checks cache
         │
    ┌────┴────┐
    │          │
   YES        NO
    │          │
    ▼          ▼
Return    Cache miss
cached    → Call fetchAllProducts()
data         │
             ▼
       contentful.ts service
       - Calls client.getEntries()
       - Gets ContentfulProduct[]
       - Transforms to Product[]
       - Validates data
             │
             ▼
       .getEntries() → Contentful API
             │
             ▼
       Returns JSON response
       (CategoryRef, VariantRef, etc.)
             │
             ▼
       Transform response
       - Category ref → category name
       - Variant refs → variant objects
       - Asset URLs → optimized URLs
             │
             ▼
       Return Product[]
             │
             ▼
React Query caches result
(5 minute TTL)
             │
             ▼
Component receives data
             │
             ▼
Renders ProductCard components
             │
             ▼
User sees products! ✓
```

---

## 3. Cache Strategy Diagram

```
Time -->

Request 1 (Fresh)
│
├─ Fetch from API ─────► Cache (TTL: 5 min)
│
└─ Return data to component
  
Request 2 (0.5s later, Fresh)
│
├─ Check cache: HIT ✓ (Still fresh)
│
└─ Return cached data (no API call)

Request 3 (6 minutes later, Stale)
│
├─ Check cache: HIT ✓ (Stale, but still valid)
├─ Return cached data immediately
├─ Fetch fresh data in background
│
└─ Update when fresh data arrives

Request 4 (11 minutes later, Expired)
│
├─ Check cache: MISS (expired from gc time)
│
├─ Fetch from API
│
└─ Return data & cache
```

Configuration:
- **staleTime: 5 min** - Data considered "fresh" and won't refetch
- **gcTime: 10 min** - Keep data in memory even after stale
- After 10 min, cache is cleared from memory

---

## 4. Component Integration Flow

```
                    ┌──────────────────┐
                    │   Shop.tsx        │
                    │   (Main Page)     │
                    └────────┬──────────┘
                             │
                    ┌────────▼─────────┐
                    │ useAllProducts() │
                    │                  │
                    │ Returns:         │
                    │ - data []        │
                    │ - isLoading      │
                    │ - error          │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        Is Loading?   Error occurred?   Has data?
              │              │              │
              ▼              ▼              ▼
         Render         Render        Render
         <Spinner/>     <Error/>       <Products/>
                                           │
                                    ┌──────▼──────┐
                                    │ Map through │
                                    │  products   │
                                    └──────┬──────┘
                                           │
                          ┌────────────────┼────────────────┐
                          │                │                │
                          ▼                ▼                ▼
                     Product 1         Product 2        Product N
                          │                │                │
                          ▼                ▼                ▼
                   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                   │ProductCard   │  │ProductCard   │  │ProductCard   │
                   │              │  │              │  │              │
                   │onClick →     │  │onClick →     │  │onClick →     │
                   │setSelectedP  │  │setSelectedP  │  │setSelectedP  │
                   │ & open Modal │  │ & open Modal │  │ & open Modal │
                   └──────────────┘  └──────────────┘  └──────────────┘
                          │                │                │
                          └────────────────┼────────────────┘
                                           │
                                           ▼
                                   ┌──────────────────┐
                                   │ProductModal      │
                                   │Display selected  │
                                   │product details   │
                                   └──────────────────┘
```

---

## 5. Error Handling Flow

```
Component calls useAllProducts()
         │
         ▼
Query function executes
         │
    ┌────┴────────────────┐
    │                     │
   YES                    NO
    │                     │
    ▼                     ▼
Success            Error occurred
 Return                  │
 data              ┌─────┴─────┐
                   │           │
              Retry?      Max retries?
               (2x)            │
                │              ▼
              YES          Return error
                │              │
                ▼              ▼
           Wait & retry    error = {
           (exponential      message: "...",
            backoff)         statusCode: 401,
                │            ...
                ▼          }
             Retry                │
             (repeats)            ▼
                │          Component receives
                └─────────► error object
                               │
                               ▼
                        Render error UI
                        Show message
                        Retry button
```

---

## 6. State Management Timeline

```
Component Mount
      │
      ▼
useAllProducts() called
      │
      ├─ isLoading: true  ◄── Initial state
      ├─ error: null
      ├─ data: undefined
      │
      ▼
Query starts
      │
      ├─ Checks cache (miss)
      ├─ Calls API
      ├─ Waiting for response...
      │
      ▼ Response arrives
      │
      ├─ isLoading: false  ◄── Update immediately
      ├─ error: null
      ├─ data: Product[]   ◄── Now has data
      │
      ▼
Component re-renders
      │
      ├─ Show products
      ├─ Hide spinner
      ├─ Hide error message
      │
      ▼
User interaction
      │
      ├─ Click product
      ├─ Open modal
      ├─ Already cached, instant!
      │
      ▼
After 5 minutes
      │
      ├─ isLoading: false (data still valid)
      ├─ Error: null
      ├─ data: Product[] (cached)
      │
      ▼
User focuses window
      │
      ├─ React Query refetches (stale-while-revalidate)
      ├─ Data updated in background
      ├─ Component doesn't re-render if same
      │
      ▼
User navigates away & back
      │
      ├─ Cache still valid
      ├─ Shows cached data instantly
      ├─ Fetches fresh in background
      │
      ▼
After 10 minutes total
      │
      ├─ Cache expires
      ├─ Next interaction triggers new fetch
      ├─ Back to beginning
```

---

## 7. TypeScript Type Flow

```
Contentful API Response
      │
      ▼
ContentfulProduct {
  sys: { id: string }
  fields: {
    name: string
    category: Entry<ContentfulCategory>  ◄── Reference!
    variants: Entry<ContentfulProductVariant>[]
    images: Asset[]
    ...
  }
}
      │
      ▼
transformProductEntry() in services/contentful.ts
      │
      ├─ Extract sys.id
      ├─ Resolve category ref → get name
      ├─ Resolve variant refs → get array
      ├─ Extract image URLs
      ├─ Validate required fields
      │
      ▼
Product {
  id: string              ◄── From sys.id
  name: string
  category: string        ◄── From ref.fields.name
  variants: ProductVariant[]
  images: string[]        ◄── Optimized URLs
  ...
}
      │
      ▼
useAllProducts() returns
      │
      ▼
Component receives Product[]
      │
      ├─ Fully typed
      ├─ IDE autocomplete works
      ├─ Type checking prevents bugs
      │
      ▼
ProductCard receives Product
      │
      ├─ TypeScript validates props
      ├─ All fields available
      ├─ No type errors
      │
      ▼
Render component ✓
```

---

## 8. Caching Key Hierarchy

```
contentful (root)
├── products
│   ├── all-products (query key)
│   ├── featured-products
│   ├── products-category-[slug]
│   ├── products-filtered
│   └── search-[query]
│
├── product (single)
│   ├── product-[id]
│   ├── product-slug-[slug]
│   └── products-[ids]
│
├── categories
│   └── all-categories

Example:
['contentful', 'products'] ─► all products
['contentful', 'product-slug', 'serum'] ─► single by slug
['contentful', 'products-category', 'skincare'] ─► by category
```

---

## 9. Image Optimization Pipeline

```
Contentful Asset
      │ URL from API
      ▼
getOptimizedImageUrl(url)
      │
      ├─ Check if already optimized
      ├─ Add query parameters:
      │  ├─ w=600 (width)
      │  ├─ h=600 (height)
      │  ├─ fit=crop (maintain aspect)
      │  └─ q=80 (quality percentage)
      │
      ▼
Optimized URL
      │
      ├─ https://cdn.contentful.com/...?w=600&h=600&fit=crop&q=80
      │
      ▼
Browser loads image
      │
      ├─ lazy loading (native browser feature)
      ├─ Resized & cropped by CDN
      ├─ Compressed to 80% quality
      │
      ▼
Optimized, fast image ✓
```

---

## 10. Request Retry Logic

```
Request to API
      │
      ▼
   Attempt 1
      │
   ┌──┴──┐
  YES   NO (fails)
   │     │
Success  ▼
   │   Wait 1000ms
   │     │
   │   Attempt 2 (Retry 1/2)
   │     │
   │   ┌──┴──┐
   │  YES   NO (fails)
   │   │     │
   │Success  ▼
   │   │   Wait 2000ms (exponential backoff)
   │   │     │
   │   │   Attempt 3 (Retry 2/2)
   │   │     │
   │   │   ┌──┴──┐
   │   │  YES   NO (fails)
   │   │   │     │
   │Success│  Return error
   │   │   │     │
   └───┼───┤     │
       │   │     │
       ▼   ▼     ▼
      Return result
      (success or error)
```

Formula: `delay = min(1000 * 2^attempt, 30000)`
- Attempt 1: 1000ms
- Attempt 2: 2000ms
- Attempt 3: 4000ms (max)

---

## 11. Complete Request Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Component Mount                                          │
│    Shop.tsx renders                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 2. Hook Called                                              │
│    const { data, isLoading, error } = useAllProducts()      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 3. React Query Execution                                    │
│    - Check cache (Miss on first load)                       │
│    - Call queryFn                                           │
│    - Set isLoading = true                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 4. Contentful Service                                       │
│    - Call withRetry()                                       │
│    - Create query to API                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 5. Contentful Client                                        │
│    - Get client instance                                    │
│    - Build request with env vars                            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 6. Network Request                                          │
│    POST https://cdn.contentful.com/spaces/z9ei2.../entries │
│    Headers: Authorization: Bearer [token]                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 7. Response Received                                        │
│    JSON {                                                   │
│      items: [                                               │
│        { sys: { id: "..." }, fields: {...} },              │
│        ...                                                  │
│      ]                                                      │
│    }                                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 8. Data Transformation                                      │
│    transformProductEntry() called for each item             │
│    - Extract fields                                         │
│    - Resolve references                                     │
│    - Optimize images                                        │
│    - Return Product[]                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 9. React Query Update                                       │
│    - Cache data                                             │
│    - Set isLoading = false                                  │
│    - Set data = Product[]                                   │
│    - Set error = null                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 10. Component Re-render                                     │
│    - Products now available                                 │
│    - Show ProductCard grid                                  │
│    - Hide loading spinner                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│ 11. User Interaction                                        │
│    - Click product                                          │
│    - Open modal                                             │
│    - No fetch needed (cached!)                              │
└─────────────────────────────────────────────────────────────┘
```

---

These diagrams show how data flows through your application from Contentful to the UI!
