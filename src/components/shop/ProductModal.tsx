import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product, ProductVariant } from '@/types/shop';
import { formatPrice } from '@/data/mockProducts';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { WhatsAppOrderButton, WhatsAppInquiryButton } from './WhatsAppOrderButton';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
        product?.variants?.[0]
    );
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reset state when product changes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            // Reset after close animation
            setTimeout(() => {
                setSelectedVariant(product?.variants?.[0]);
                setQuantity(1);
                setActiveImageIndex(0);
            }, 300);
        }
    };

    if (!product) return null;

    const currentPrice = product.price + (selectedVariant?.priceModifier || 0);
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

    const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 10));
    const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1));

    const handleVariantChange = (variantName: string) => {
        const variant = product.variants?.find((v) => v.name === variantName);
        setSelectedVariant(variant);
    };

    const trustIndicators = [
        { icon: Check, text: 'Authentic Product' },
        { icon: Truck, text: 'Pay on Delivery' },
        { icon: RotateCcw, text: 'Easy Returns' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative bg-secondary/30 p-4 md:p-6">
                        {/* Main Image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImageIndex}
                                    src={product.images[activeImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>

                            {/* Discount Badge */}
                            {hasDiscount && (
                                <Badge className="absolute top-3 left-3 bg-destructive text-white">
                                    Save {formatPrice(product.compareAtPrice! - product.price)}
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 mt-4 justify-center">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-transparent hover:border-primary/50'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="p-6 md:p-8 flex flex-col">
                        <DialogHeader className="text-left mb-4">
                            {/* Category & SKU */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    {product.category}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{product.sku}</span>
                            </div>

                            <DialogTitle className="text-2xl md:text-3xl font-serif font-medium text-foreground">
                                {product.name}
                            </DialogTitle>
                        </DialogHeader>

                        {/* Trust Badges */}
                        {product.trustBadges && product.trustBadges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {product.trustBadges.map((badge) => (
                                    <Badge
                                        key={badge}
                                        variant="secondary"
                                        className="text-xs font-normal"
                                    >
                                        {badge}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl font-semibold text-primary">
                                {formatPrice(currentPrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-muted-foreground line-through">
                                    {formatPrice(product.compareAtPrice!)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-6">
                            {product.inStock ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                                    {product.stockQuantity && product.stockQuantity <= 5 && (
                                        <span className="text-sm text-amber-600">
                                            (Only {product.stockQuantity} left!)
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                                {product.description}
                            </p>
                        </div>

                        {/* Variant Selector */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-4">
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Size
                                </label>
                                <Select
                                    value={selectedVariant?.name || product.variants[0].name}
                                    onValueChange={handleVariantChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {product.variants.map((variant) => (
                                            <SelectItem key={variant.name} value={variant.name}>
                                                {variant.name}
                                                {variant.priceModifier > 0 && (
                                                    <span className="text-muted-foreground ml-2">
                                                        (+{formatPrice(variant.priceModifier)})
                                                    </span>
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                <button
                                    onClick={incrementQuantity}
                                    disabled={quantity >= 10}
                                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3 mt-auto">
                            <WhatsAppOrderButton
                                product={product}
                                selectedVariant={selectedVariant}
                                quantity={quantity}
                            />
                            <WhatsAppInquiryButton product={product} />
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border">
                            {trustIndicators.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex flex-col items-center text-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
