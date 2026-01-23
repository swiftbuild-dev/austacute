import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/mockProducts';
import { Product } from '@/types/shop';
import { ProductCard } from './shop/ProductCard';
import { ProductModal } from './shop/ProductModal';
import { Button } from '@/components/ui/button';

export const ShopPreview = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Get featured products (or first 3)
    const featuredProducts = products.filter((p) => p.featured).slice(0, 3);

    return (
        <>
            <section id="shop" className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 via-background to-background">
                <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        ref={headerRef}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Premium Skincare
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
                            Shop Our Products
                        </h2>
                        <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Discover our curated collection of premium skincare products.
                            Order directly via WhatsApp – no online payment needed.
                        </p>
                    </motion.div>

                    {/* Trust Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12 text-sm text-muted-foreground"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>100% Authentic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Pay on Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Easy Returns</span>
                        </div>
                    </motion.div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                        {featuredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* View All CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <Link to="/shop">
                            <Button
                                variant="outline"
                                size="lg"
                                className="group border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                View All Products
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};
