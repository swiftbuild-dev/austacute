
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Product, ProductVariant } from '@/types/shop';
import { formatPrice } from '@/data/mockProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WhatsAppOrderButton, WhatsAppInquiryButton } from './WhatsAppOrderButton';
import {
    Dialog,
    DialogContent,
    DialogClose,
} from '@/components/ui/dialog';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reset state when product changes or modal opens
    useEffect(() => {
        if (product) {
            setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
            setQuantity(1);
            setActiveImageIndex(0);
        }
    }, [product, isOpen]);

    if (!product) return null;

    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const currentPrice = (product.price + (selectedVariant?.priceModifier || 0)) * quantity;
    const originalPrice = hasDiscount
        ? (product.compareAtPrice! + (selectedVariant?.priceModifier || 0)) * quantity
        : null;

    const discountPercentage = hasDiscount
        ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
        : 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white gap-0 border-none sm:rounded-3xl" hideCloseButton>
                <div className="grid grid-cols-1 md:grid-cols-2 h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto md:overflow-hidden">

                    {/* Image Section */}
                    <div className="relative bg-secondary/20 h-[50vh] md:h-full min-h-[300px] flex items-center justify-center p-6">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImageIndex}
                                src={product.images[activeImageIndex]}
                                alt={product.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-contain max-h-[400px] mix-blend-multiply"
                            />
                        </AnimatePresence>

                        {/* Image Navigation Dots */}
                        {product.images.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {product.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeImageIndex
                                            ? 'bg-primary w-4'
                                            : 'bg-primary/30 hover:bg-primary/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}


                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
                        <DialogClose className="absolute right-2 top-2 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
                            <div className="bg-black/5 hover:bg-black/10 rounded-full p-2">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </div>
                        </DialogClose>

                        <div className="mb-6">
                            <p className="text-sm text-primary font-medium tracking-wide uppercase mb-2">
                                {product.category}
                            </p>
                            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                                {product.name}
                            </h2>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(currentPrice)}
                                </span>
                                {hasDiscount && originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through decoration-destructive/30">
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-3 block">
                                    Select Volume
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.name}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`
                                                relative px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                                                ${selectedVariant?.name === variant.name
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border hover:border-primary/50 text-muted-foreground'
                                                }
                                            `}
                                        >
                                            {variant.name}
                                            {selectedVariant?.name === variant.name && (
                                                <div className="absolute -top-1.5 -right-1.5 bg-primary text-white p-0.5 rounded-full">
                                                    <Check className="w-2 h-2" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="text-sm font-medium text-foreground mb-3 block">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-secondary/50 transition-colors disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-medium">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-secondary/50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <WhatsAppOrderButton
                                product={product}
                                selectedVariant={selectedVariant}
                                quantity={quantity}
                                fullWidth
                                className={!product.inStock ? 'opacity-50 pointer-events-none' : ''}
                            />

                            <WhatsAppInquiryButton
                                product={product}
                            />

                            {!product.inStock && (
                                <p className="text-center text-sm text-destructive mt-2">
                                    Currently out of stock. Use the inquiry button to check restock updates.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
