import { MessageCircle } from 'lucide-react';
import { Product, ProductVariant } from '@/types/shop';
import { formatPrice, WHATSAPP_NUMBER } from '@/data/mockProducts';
import { Button } from '@/components/ui/button';

interface WhatsAppOrderButtonProps {
    product: Product;
    selectedVariant?: ProductVariant;
    quantity: number;
    className?: string;
    fullWidth?: boolean;
}

export const WhatsAppOrderButton = ({
    product,
    selectedVariant,
    quantity,
    className = '',
    fullWidth = true,
}: WhatsAppOrderButtonProps) => {
    const calculateTotalPrice = (): number => {
        const basePrice = product.price;
        const variantModifier = selectedVariant?.priceModifier || 0;
        return basePrice + variantModifier;
    };

    const generateWhatsAppMessage = (): string => {
        const unitPrice = calculateTotalPrice();
        const variantText = selectedVariant ? ` (${selectedVariant.name})` : '';

        const message = `Hi AustaCute! 👋

I'd like to order:
📦 Product: ${product.name}${variantText}
🔢 Quantity: ${quantity}
💰 Unit Price: ${formatPrice(unitPrice)}
📍 Ref: ${product.sku}

Please confirm availability and delivery details.
Thank you!`;

        return message;
    };

    const handleClick = () => {
        const message = generateWhatsAppMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Button
            onClick={handleClick}
            className={`
        bg-[#25D366] hover:bg-[#128C7E] text-white font-medium
        flex items-center justify-center gap-2
        transition-all duration-300 shadow-md hover:shadow-lg
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            size="lg"
        >
            <MessageCircle className="w-5 h-5" />
            Order via WhatsApp
        </Button>
    );
};

// Secondary button for asking questions
interface WhatsAppInquiryButtonProps {
    product: Product;
    className?: string;
}

export const WhatsAppInquiryButton = ({
    product,
    className = '',
}: WhatsAppInquiryButtonProps) => {
    const handleClick = () => {
        const message = `Hi AustaCute! 👋

I have a question about:
📦 ${product.name} (${product.sku})

[Type your question here]`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            className={`
        border-primary/30 text-primary hover:bg-primary/5
        flex items-center justify-center gap-2
        transition-all duration-300 w-full
        ${className}
      `}
            size="lg"
        >
            <MessageCircle className="w-4 h-4" />
            Ask a Question
        </Button>
    );
};
