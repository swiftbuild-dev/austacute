import { Product, Category } from '@/types/shop';

// Placeholder images - using high-quality skincare product images
// These will be replaced with actual product images or Contentful images later
const placeholderImages = {
    serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80',
    serumAlt: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&h=600&fit=crop&q=80',
    moisturizer: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop&q=80',
    moisturizerAlt: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=600&h=600&fit=crop&q=80',
    cleanser: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80',
    cleanserAlt: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&q=80',
};

export const categories: Category[] = [
    {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Premium skincare products for radiant, healthy skin',
    },
];

export const products: Product[] = [
    {
        id: '1',
        name: 'Hydrating Glow Serum',
        slug: 'hydrating-glow-serum',
        sku: 'SKU-HGS-30',
        price: 15500,
        compareAtPrice: 18000,
        shortDescription: 'Intensive hydration for a luminous, dewy complexion',
        description: `Our bestselling Hydrating Glow Serum is formulated with hyaluronic acid and vitamin C to deeply hydrate and brighten your skin. This lightweight, fast-absorbing serum penetrates deep into the skin layers, locking in moisture for up to 72 hours.

Perfect for all skin types, especially dry and dull skin. Use morning and night for best results. Within 2 weeks, you'll notice visibly plumper, more radiant skin.

• Hyaluronic Acid - Deep hydration
• Vitamin C - Brightening & antioxidant protection
• Niacinamide - Pore refinement
• Suitable for sensitive skin
• Dermatologically tested`,
        images: [placeholderImages.serum, placeholderImages.serumAlt],
        category: 'skincare',
        variants: [
            { name: '30ml', priceModifier: 0 },
            { name: '50ml', priceModifier: 6500 },
        ],
        inStock: true,
        stockQuantity: 15,
        featured: true,
        trustBadges: ['Bestseller', 'Cruelty-Free', 'Dermatologist Approved'],
    },
    {
        id: '2',
        name: 'Radiance Repair Moisturizer',
        slug: 'radiance-repair-moisturizer',
        sku: 'SKU-RRM-50',
        price: 12000,
        shortDescription: 'Rich, nourishing cream for supple, youthful skin',
        description: `The Radiance Repair Moisturizer is a luxurious cream that repairs and restores your skin's natural barrier. Enriched with shea butter, ceramides, and botanical extracts, this moisturizer provides long-lasting nourishment without feeling heavy or greasy.

Ideal for normal to dry skin. Apply after cleansing and serum application. Your skin will feel instantly softer and more supple.

• Shea Butter - Deep nourishment
• Ceramides - Barrier repair
• Aloe Vera - Soothing & calming
• Non-comedogenic
• Fragrance-free`,
        images: [placeholderImages.moisturizer, placeholderImages.moisturizerAlt],
        category: 'skincare',
        variants: [
            { name: '50ml', priceModifier: 0 },
            { name: '100ml', priceModifier: 5000 },
        ],
        inStock: true,
        stockQuantity: 8,
        featured: true,
        trustBadges: ['Organic Ingredients', 'Paraben-Free'],
    },
    {
        id: '3',
        name: 'Gentle Purifying Cleanser',
        slug: 'gentle-purifying-cleanser',
        sku: 'SKU-GPC-150',
        price: 8500,
        shortDescription: 'Mild, effective cleanser that respects your skin',
        description: `Start your skincare routine right with our Gentle Purifying Cleanser. This soap-free formula removes makeup, dirt, and impurities without stripping your skin of its natural oils. The creamy lather leaves your face feeling clean, soft, and refreshed.

Suitable for all skin types, including sensitive skin. Use morning and evening as the first step of your skincare routine.

• Glycerin - Moisture retention
• Green Tea Extract - Antioxidant protection
• Chamomile - Calming properties
• pH-balanced formula
• Removes waterproof makeup`,
        images: [placeholderImages.cleanser],
        category: 'skincare',
        variants: [
            { name: '150ml', priceModifier: 0 },
            { name: '250ml', priceModifier: 3500 },
        ],
        inStock: true,
        stockQuantity: 20,
        featured: true,
        trustBadges: ['Gentle Formula', 'All Skin Types'],
    },
];

// Helper function to format Nigerian Naira
export const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
    return products.filter((p) => p.featured);
};

// Get product by slug
export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
};

// WhatsApp business number
export const WHATSAPP_NUMBER = '2347088531785';
