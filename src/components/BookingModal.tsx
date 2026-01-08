
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const message = `Hello, I just booked a consultation.

Name: ${formData.name}
Phone: ${formData.phone}
Business Type: Service - ${formData.service}
What I need: ${formData.email ? `Email: ${formData.email}` : ''} - Booking Request`;

        const whatsappUrl = `https://wa.me/2347060699305?text=${encodeURIComponent(message.trim())}`;

        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-primary">Book Free Consultation</DialogTitle>
                    <DialogDescription>
                        Fill in your details below. You'll be redirected to WhatsApp to complete your booking.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Enter your full name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (WhatsApp preferred) <span className="text-destructive">*</span></Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. 0803 123 4567"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email (optional)"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="service">Service You Want to Book <span className="text-destructive">*</span></Label>
                        <Select
                            required
                            value={formData.service}
                            onValueChange={(value) => setFormData({ ...formData, service: value })}
                        >
                            <SelectTrigger id="service">
                                <SelectValue placeholder="Select a service..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="skincare">Skincare Treatment</SelectItem>
                                <SelectItem value="facial">Facial Treatment</SelectItem>
                                <SelectItem value="dental">Dental Consultation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4 flex-col gap-2 sm:gap-0">
                        <div className="text-xs text-center text-muted-foreground w-full mb-2 order-last sm:order-first">
                            You will be redirected to WhatsApp to send your details.
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Redirecting...
                                </>
                            ) : (
                                'Proceed to WhatsApp'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
