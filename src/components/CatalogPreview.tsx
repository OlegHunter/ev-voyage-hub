import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

export const CatalogPreview = () => {
  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "InStock")
        .limit(6)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      InStock: "secondary",
      OnTheWay: "default",
      PreOrder: "outline",
    };
    const labels: Record<string, string> = {
      InStock: "В наявності",
      OnTheWay: "В дорозі",
      PreOrder: "Під замовлення",
    };
    return { variant: variants[status] || "default", label: labels[status] || status };
  };

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse bg-card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl">
            Популярні <span className="text-primary">моделі</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Більше 50 моделей електромобілів 2015–2025 років у наявності та під замовлення
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cars?.map((car) => {
            const badge = getStatusBadge(car.status);
            const specs = car.specs as { power_kw?: number; battery_kwh?: number; acceleration?: number };
            
            return (
              <Card
                key={car.id}
                className="overflow-hidden group hover:shadow-glow transition-all duration-mid"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  {car.images && car.images[0] && (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-mid"
                    />
                  )}
                  <Badge className="absolute top-4 right-4" variant={badge.variant}>
                    {badge.label}
                  </Badge>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {car.year} • {car.source_country}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-secondary" />
                      <span>{car.range_km} км</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gauge className="h-3 w-3 text-accent" />
                      <span>{specs.power_kw || 0} kW</span>
                    </div>
                    <div className="text-muted-foreground">
                      {car.mileage_km?.toLocaleString()} км
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-2xl font-heading font-bold text-secondary">
                        ${car.price_usd.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">під ключ</div>
                    </div>
                    <Link to={`/catalog?car=${car.id}`}>
                      <Button size="sm" variant="outline">
                        Детальніше
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <Link to="/catalog">
            <Button size="lg">
              Дивитися весь каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};