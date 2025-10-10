import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Gauge, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const Catalog = () => {
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minYear, setMinYear] = useState<number>(2015);
  
  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars", brandFilter, statusFilter, minYear],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select("*")
        .gte("year", minYear)
        .order("created_at", { ascending: false });
      
      if (brandFilter !== "all") {
        query = query.eq("brand", brandFilter);
      }
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const brands = Array.from(new Set(cars?.map(c => c.brand) || [])).sort();

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="space-y-8">
          <div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Каталог <span className="text-primary">електромобілів</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {cars?.length || 0} автомобілів у наявності та під замовлення
            </p>
          </div>
          
          {/* Filters */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="font-heading font-bold text-xl">Фільтри</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Бренд</label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Всі бренди" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі бренди</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Статус</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Всі статуси" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі статуси</SelectItem>
                    <SelectItem value="InStock">В наявності</SelectItem>
                    <SelectItem value="OnTheWay">В дорозі</SelectItem>
                    <SelectItem value="PreOrder">Під замовлення</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Мінімальний рік</label>
                <Input
                  type="number"
                  min={2015}
                  max={2025}
                  value={minYear}
                  onChange={(e) => setMinYear(parseInt(e.target.value) || 2015)}
                />
              </div>
            </div>
          </Card>
          
          {/* Results */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse bg-card" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <Link to={`/catalog/${car.id}`}>
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;