
## Plan: Fix Contentful CMS Integration TypeScript Errors

The existing Contentful integration has significant TypeScript errors because the code was written for an older version of the Contentful SDK. The installed version is **v11.10.2**, which introduced breaking changes in v10.0.0 requiring a completely different type system.

### Root Cause Analysis

The Contentful SDK v10+ introduced:
1. **Entry Skeleton Types** - Types must include a `contentTypeId` field
2. **Generic `ContentfulClientApi<Modifiers>`** - Client API now requires a type argument
3. **New field access patterns** - Fields are accessed differently with locale-aware responses

### Files to Modify

1. **`src/lib/contentful.ts`** - Fix client configuration and type definitions
2. **`src/services/contentful.ts`** - Fix data fetching and transformation logic
3. **`src/hooks/useContentful.ts`** - Fix error type handling

---

### Step 1: Rewrite Type Definitions in `src/lib/contentful.ts`

Update types to use the new EntrySkeletonType pattern:

```typescript
import { createClient, EntryFieldTypes, ChainModifiers } from 'contentful';
import type { ContentfulClientApi, Asset, Entry, EntrySkeletonType } from 'contentful';

// Define skeleton types with contentTypeId (required in v10+)
type CategorySkeleton = EntrySkeletonType<{
  name: EntryFieldTypes.Text;
  slug: EntryFieldTypes.Text;
  description?: EntryFieldTypes.Text;
}, 'category'>;

type ProductVariantSkeleton = EntrySkeletonType<{
  name: EntryFieldTypes.Text;
  priceModifier: EntryFieldTypes.Integer;
}, 'productVariant'>;

type ProductSkeleton = EntrySkeletonType<{
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
}, 'product'>;
```

### Step 2: Fix ContentfulClientApi Type

The client now requires the `ChainModifiers` type argument:

```typescript
// Use undefined for default modifiers (no withAllLocales, withoutLinkResolution, etc.)
let contentfulClient: ContentfulClientApi<undefined> | null = null;

export const getContentfulClient = (): ContentfulClientApi<undefined> => {
    if (!contentfulClient) {
        contentfulClient = initializeContentfulClient();
    }
    return contentfulClient;
};

const initializeContentfulClient = (): ContentfulClientApi<undefined> => {
    // ... existing implementation
    return createClient({
        space: spaceId,
        accessToken: previewToken || accessToken,
        host: previewToken ? 'preview.contentful.com' : 'cdn.contentful.com',
    });
};
```

### Step 3: Fix Image URL Extraction

The `file.url` type changed to potentially be `AssetFile` instead of just `string`:

```typescript
export const extractImageUrls = (assets: Asset<undefined, string>[]): string[] => {
    if (!assets || assets.length === 0) {
        return [];
    }

    return assets.map((asset) => {
        const file = asset.fields.file;
        if (!file || typeof file.url !== 'string') {
            return '';
        }
        return getOptimizedImageUrl(file.url);
    }).filter(Boolean);
};
```

### Step 4: Update Data Fetching in `src/services/contentful.ts`

Fix the `getEntries` calls to use new skeleton types:

```typescript
import type { Entry, Asset, UnresolvedLink } from 'contentful';
import { CategorySkeleton, ProductSkeleton, ProductVariantSkeleton } from '@/lib/contentful';

export const fetchAllProducts = async (): Promise<Product[]> => {
    // ...
    const response = await client.getEntries<ProductSkeleton>({
        content_type: 'product',
        limit: 100,
        include: 2,
        order: ['-sys.createdAt'],
    });

    return response.items.map((item) => transformProductEntry(item));
};
```

### Step 5: Fix Entry Transformation Logic

Update `transformProductEntry` to handle the new entry structure:

```typescript
export const transformProductEntry = (
    entry: Entry<ProductSkeleton, undefined, string>
): Product => {
    const fields = entry.fields;

    // Category is now an Entry or undefined
    let categoryName = 'uncategorized';
    if (fields.category && 'fields' in fields.category) {
        categoryName = fields.category.fields.name;
    }

    // Variants are now Entry[] or undefined
    let variants: ProductVariant[] = [];
    if (fields.variants && Array.isArray(fields.variants)) {
        variants = fields.variants
            .filter((v): v is Entry<ProductVariantSkeleton, undefined, string> => 
                'fields' in v
            )
            .map((variantEntry) => ({
                name: variantEntry.fields.name,
                priceModifier: variantEntry.fields.priceModifier,
            }));
    }

    // Images handling
    const images = fields.images
        ? extractImageUrls(
            fields.images.filter((img): img is Asset<undefined, string> => 
                'fields' in img
            )
          )
        : [];

    return {
        id: entry.sys.id,
        name: fields.name,
        slug: fields.slug,
        sku: fields.sku,
        price: Math.round(fields.price),
        compareAtPrice: fields.compareAtPrice 
            ? Math.round(fields.compareAtPrice) 
            : undefined,
        shortDescription: fields.shortDescription,
        description: fields.description,
        images: images.length > 0 ? images : ['/placeholder-product.jpg'],
        category: categoryName,
        variants: variants.length > 0 ? variants : undefined,
        inStock: fields.inStock ?? true,
        stockQuantity: fields.stockQuantity,
        featured: fields.featured ?? false,
        trustBadges: fields.trustBadges,
    };
};
```

### Step 6: Fix Error Type in `src/hooks/useContentful.ts`

Line 297 has a type error for the error return:

```typescript
export const useProductErrorState = (
    ...queries: UseQueryResult<unknown, unknown>[]
): Error | null => {
    const errorQuery = queries.find((query) => query.error);
    const error = errorQuery?.error;
    
    // Properly type check the error
    if (error instanceof Error) {
        return error;
    }
    if (error) {
        return new Error(String(error));
    }
    return null;
};
```

### Step 7: Environment Variables Setup

Create/update `.env.local` with your credentials (these are already documented but need to be added):

```env
VITE_CONTENTFUL_SPACE_ID=z9ei2s7jmq34
VITE_CONTENTFUL_ACCESS_TOKEN=1D1JdXttqP3jIt6Xasfcs_IIFyHBOtpvfmuUliWmkgc
```

**Note**: These are publishable Content Delivery API keys, so storing them in the frontend is acceptable.

---

### Summary of Changes

| File | Changes |
|------|---------|
| `src/lib/contentful.ts` | New skeleton types with `contentTypeId`, fix `ContentfulClientApi<undefined>`, fix `extractImageUrls` |
| `src/services/contentful.ts` | Update all `getEntries` calls, fix `transformProductEntry` with proper type guards |
| `src/hooks/useContentful.ts` | Fix error type handling in `useProductErrorState` |

### Post-Implementation

After the fixes are applied:
1. The build errors will be resolved
2. The Shop page will fetch products from Contentful instead of mock data
3. You can update `src/components/ShopPreview.tsx` and `src/pages/Shop.tsx` to use `useFeaturedProducts()` and `useAllProducts()` hooks instead of the mock data import
