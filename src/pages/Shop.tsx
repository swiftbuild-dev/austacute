import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Shield, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductModal } from '@/components/shop/ProductModal';
import { products, WHATSAPP_NUMBER } from '@/data/mockProducts';
import { Product } from '@/types/shop';

const Shop = () => {
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

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        ref={headerRef}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            AustaCute Collection
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-6">
                            Shop Our Products
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                            Premium skincare products for radiant, healthy skin.
                            Order hassle-free via WhatsApp – no card payments, no stress.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Authentic Products</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Pay on Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Lagos Delivery</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
                    >
                        <div>
                            <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-2">
                                All Products
                            </h2>
                            <p className="text-muted-foreground">
                                {products.length} premium skincare products
                            </p>
                        </div>
                    </motion.div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
                            Why Shop With Us?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We believe in building trust through transparency and excellent service
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trustFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border/50"
                                >
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-primary">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
                            Have Questions?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Not sure which product is right for you? Chat with us on WhatsApp for
                            personalized recommendations.
                        </p>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                'Hi AustaCute! 👋 I have a question about your products.'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-medium 
                hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Chat with Us
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </main>
    );
};

export default Shop;
