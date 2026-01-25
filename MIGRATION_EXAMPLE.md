/**
 * MIGRATION EXAMPLE: Shop.tsx with Contentful Integration
 *
 * This file shows the complete updated Shop.tsx with Contentful integration.
 * It demonstrates:
 * - Fetching products from Contentful
 * - Handling loading and error states
 * - Maintaining existing UI/UX
 * - Type safety with Product interface
 *
 * To apply this to your actual Shop.tsx:
 * 1. Replace the import from mockProducts with Contentful hooks
 * 2. Add loading and error state handling
 * 3. Update the products source in the render method
 * 4. Everything else stays the same!
 */

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Shield, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductModal } from '@/components/shop/ProductModal';
import { useAllProducts } from '@/hooks/useContentful'; // Changed from mockProducts
import { Product } from '@/types/shop';
import { WHATSAPP_NUMBER, formatPrice } from '@/data/mockProducts'; // Keep formatPrice utility

const Shop = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });

    // Fetch products from Contentful instead of mock data
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
        {
            icon: Truck,
            title: 'Pay on Delivery',
            description: 'No online payment required. Pay when your order arrives',
        },
        {
            icon: RotateCcw,
            title: 'Easy Returns',
            description: 'Not satisfied? Return within 7 days for a full refund',
        },
        {
            icon: MessageCircle,
            title: 'WhatsApp Support',
            description: 'Quick responses and personalized assistance via WhatsApp',
        },
    ];

    // ==================== NEW: Loading State ====================
    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center min-h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mb-4"></div>
                        <p className="text-muted-foreground text-lg">Loading our beautiful products...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // ==================== NEW: Error State ====================
    if (error) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center min-h-96 bg-destructive/10 rounded-lg border border-destructive/20 p-6">
                        <Sparkles className="h-12 w-12 text-destructive mb-4" />
                        <h2 className="text-2xl font-bold text-destructive mb-2">
                            Unable to Load Products
                        </h2>
                        <p className="text-muted-foreground text-center mb-4">
                            {error.message || 'An unexpected error occurred. Please try refreshing the page.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // ==================== Main Content ====================
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <motion.section
                ref={headerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 py-12 lg:py-16"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        AustaCute Shop
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our premium collection of skincare products. Each product is carefully selected and
                        formulated for your skin's health and beauty.
                    </p>
                </div>
            </motion.section>

            {/* Products Grid - Changed from products to use Contentful data */}
            <section className="container mx-auto px-4 py-12">
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No products available at the moment. Please check back soon!
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-8">All Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => handleProductClick(product)}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Trust Features Section - unchanged */}
            <section className="bg-primary/5 py-16 border-y border-primary/10">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Shop With Us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trustFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-primary/10 rounded-full">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Product Modal - unchanged */}
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

/**
 * MIGRATION NOTES:
 *
 * 1. IMPORTS CHANGED:
 *    ❌ import { products } from '@/data/mockProducts';
 *    ✅ import { useAllProducts } from '@/hooks/useContentful';
 *
 * 2. HOOK USAGE ADDED:
 *    const { data: products = [], isLoading, error } = useAllProducts();
 *    - data: Array of products (empty array as default)
 *    - isLoading: Boolean, true while fetching
 *    - error: Error object if fetch failed
 *
 * 3. LOADING STATE:
 *    Added a loading spinner while products fetch
 *    Shows a friendly message to users
 *
 * 4. ERROR STATE:
 *    Added error handling with retry button
 *    Doesn't break the app if Contentful is unavailable
 *
 * 5. DATA TRANSFORMATION:
 *    Product data is already transformed in services/contentful.ts
 *    Components don't need to know about Contentful format
 *
 * 6. TYPE SAFETY:
 *    useAllProducts<Product[]> ensures type safety
 *    Error states properly typed with ContentfulError
 *
 * 7. PERFORMANCE:
 *    React Query handles caching automatically
 *    Subsequent page visits won't re-fetch (5 min cache)
 *    Stale-while-revalidate pattern keeps data fresh
 *
 * 8. EVERYTHING ELSE STAYS THE SAME:
 *    ✓ UI/UX unchanged
 *    ✓ Component structure unchanged
 *    ✓ Styling unchanged
 *    ✓ formatPrice utility still works
 *    ✓ WHATSAPP_NUMBER still imported from mock data
 */
