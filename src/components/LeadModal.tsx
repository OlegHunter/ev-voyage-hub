import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Ім'я повинно містити мінімум 2 символи" })
    .max(100, { message: "Ім'я занадто довге" })
    .regex(/^[\p{L}\s'-]+$/u, { message: "Ім'я містить недопустимі символи" }),
  phone: z.string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, { message: "Невірний формат телефону (тільки цифри, 10-15 символів)" }),
  email: z.string()
    .trim()
    .email({ message: "Невірний формат email" })
    .max(255)
    .optional()
    .or(z.literal('')),
  message: z.string()
    .trim()
    .max(2000, { message: "Повідомлення занадто довге (макс. 2000 символів)" })
    .optional()
    .or(z.literal(''))
});

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId?: string;
  source?: string;
}

export const LeadModal = ({ open, onOpenChange, carId, source = "website" }: LeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input data
      const validatedData = leadSchema.parse({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message
      });

      // Call the process-lead edge function
      const { data, error } = await supabase.functions.invoke('process-lead', {
        body: {
          name: validatedData.name,
          phone: validatedData.phone,
          email: validatedData.email || undefined,
          comment: validatedData.message || undefined,
          car_id: carId || undefined,
          source_page: source,
          type: carId ? 'car_inquiry' : 'general'
        }
      });

      if (error) throw error;

      toast({
        title: "Заявка відправлена!",
        description: "Наш менеджер зв'яжеться з вами найближчим часом.",
      });

      setFormData({ name: "", phone: "", email: "", message: "" });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Помилка валідації",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Помилка",
          description: "Не вдалося відправити заявку. Спробуйте ще раз.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Залишити заявку
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ім'я *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ваше ім'я"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+380 XX XXX XX XX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Повідомлення</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Розкажіть про ваші побажання..."
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Відправка..." : "Відправити заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
