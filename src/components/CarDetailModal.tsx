import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Gauge, Battery, MapPin, Calendar, Clock, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";

interface CarDetailModalProps {
  carId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReserve: (carId: string) => void;
}

export const CarDetailModal = ({ carId, open, onOpenChange, onReserve }: CarDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", carId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  if (isLoading || !car) {
    return null;
  }

  const specs = car.specs as {
    power_kw?: number;
    battery_kwh?: number;
    acceleration?: number;
    top_speed?: number;
    seats?: number;
    drive?: string;
    charging_time?: number;
  };

  const images = car.images || [];
  const statusLabels: Record<string, string> = {
    InStock: "В наявності",
    OnTheWay: "В дорозі",
    PreOrder: "Під замовлення",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl">
            {car.brand} {car.model} {car.trim && `• ${car.trim}`}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{statusLabels[car.status]}</Badge>
            <span>•</span>
            <span>{car.year}</span>
            <span>•</span>
            <span>{car.source_country}</span>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Zap className="h-24 w-24 text-primary/20" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 3D Placeholder */}
            <div className="p-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 text-center space-y-2">
              <div className="text-sm text-muted-foreground">🎨 3D Огляд (незабаром)</div>
              <p className="text-xs text-muted-foreground">
                Інтерактивний 3D-огляд автомобіля
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Price */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                ${car.price_usd.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Повна вартість під ключ з доставкою та розмитненням
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-success" />
                <span>Економія до $5000 порівняно з Європою</span>
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border space-y-2">
                <Zap className="h-5 w-5 text-success" />
                <p className="text-2xl font-bold">{car.range_km} км</p>
                <p className="text-xs text-muted-foreground">Запас ходу</p>
              </div>
              <div className="p-4 rounded-lg bg-card border space-y-2">
                <Gauge className="h-5 w-5 text-accent" />
                <p className="text-2xl font-bold">{specs.power_kw || "N/A"} kW</p>
                <p className="text-xs text-muted-foreground">Потужність</p>
              </div>
              <div className="p-4 rounded-lg bg-card border space-y-2">
                <Battery className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold">{specs.battery_kwh || "N/A"} kWh</p>
                <p className="text-xs text-muted-foreground">Батарея</p>
              </div>
              <div className="p-4 rounded-lg bg-card border space-y-2">
                <Clock className="h-5 w-5 text-warning" />
                <p className="text-2xl font-bold">{car.mileage_km?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Пробіг км</p>
              </div>
            </div>

            <Separator />

            {/* Detailed Specs */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg">Характеристики</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {specs.acceleration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Розгін 0-100:</span>
                    <span className="font-medium">{specs.acceleration}s</span>
                  </div>
                )}
                {specs.top_speed && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Макс. швидкість:</span>
                    <span className="font-medium">{specs.top_speed} км/год</span>
                  </div>
                )}
                {specs.seats && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Місць:</span>
                    <span className="font-medium">{specs.seats}</span>
                  </div>
                )}
                {specs.drive && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Привід:</span>
                    <span className="font-medium">{specs.drive}</span>
                  </div>
                )}
                {specs.charging_time && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Зарядка (швидка):</span>
                    <span className="font-medium">{specs.charging_time} хв</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Повна технічна інспекція перед відправкою</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-success" />
                <span>12 місяців гарантії на батарею</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Доставка 45-60 днів</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => onReserve(car.id)} size="lg" className="flex-1">
                Резервувати авто
              </Button>
              <Button variant="outline" size="lg">
                Розрахувати вартість
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
