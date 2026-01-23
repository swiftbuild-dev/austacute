import { motion } from 'framer-motion';
import { Product } from '@/types/shop';
import { formatPrice } from '@/data/mockProducts';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
    index?: number;
}

export const ProductCard = ({ product, onClick, index = 0 }: ProductCardProps) => {
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
        : 0;

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={onClick}
        >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hasDiscount && (
                            <Badge className="bg-destructive text-white text-xs font-medium px-2 py-1">
                                -{discountPercentage}%
                            </Badge>
                        )}
                        {product.trustBadges?.[0] && (
                            <Badge className="bg-primary text-white text-xs font-medium px-2 py-1">
                                {product.trustBadges[0]}
                            </Badge>
                        )}
                    </div>

                    {/* Stock Status */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-medium text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                    {/* Category */}
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {product.category}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-lg font-serif font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.shortDescription}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-primary">
                            {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.compareAtPrice!)}
                            </span>
                        )}
                    </div>

                    {/* CTA Hint */}
                    <div className="mt-4 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Details</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};
