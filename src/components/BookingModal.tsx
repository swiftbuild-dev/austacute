
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
import { CheckCircle2, Loader2 } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const resetForm = () => {
        setFormData({ name: '', phone: '', email: '', service: '' });
        setIsSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-primary">Book Free Consultation</DialogTitle>
                            <DialogDescription>
                                Fill in your details below and we'll contact you shortly to confirm your appointment.
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
                                <p className="text-xs text-muted-foreground">Make this required</p>
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

                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Booking...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-serif text-primary">Booking Confirmed!</DialogTitle>
                        <DialogDescription className="text-lg">
                            Thank you, {formData.name}. We have received your request and will contact you via WhatsApp at {formData.phone} shortly.
                        </DialogDescription>
                        <Button onClick={resetForm} className="w-full mt-4">
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
