import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Gauge, Filter, X, TrendingUp, Shield, Clock } from "lucide-react";
import { CarDetailModal } from "@/components/CarDetailModal";
import { LeadModal } from "@/components/LeadModal";
import { EmptyStateCatalog } from "@/components/EmptyStateCatalog";

const Catalog = () => {
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minYear, setMinYear] = useState<number>(2015);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRange, setMinRange] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadCarId, setLeadCarId] = useState<string | undefined>();
  
  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars", brandFilter, statusFilter, minYear, priceRange, minRange, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select("*")
        .gte("year", minYear)
        .gte("price_usd", priceRange[0])
        .lte("price_usd", priceRange[1])
        .gte("range_km", minRange)
        .order("created_at", { ascending: false });
      
      if (brandFilter !== "all") {
        query = query.eq("brand", brandFilter);
      }
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }
      
      if (searchQuery) {
        query = query.or(`brand.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const brands = Array.from(new Set(cars?.map(c => c.brand) || [])).sort();
  const activeFiltersCount = [
    brandFilter !== "all",
    statusFilter !== "all",
    minYear !== 2015,
    priceRange[0] !== 0 || priceRange[1] !== 100000,
    minRange !== 0,
    searchQuery !== ""
  ].filter(Boolean).length;

  const resetFilters = () => {
    setBrandFilter("all");
    setStatusFilter("all");
    setMinYear(2015);
    setPriceRange([0, 100000]);
    setMinRange(0);
    setSearchQuery("");
  };

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

  const handleReserve = (carId: string) => {
    setLeadCarId(carId);
    setLeadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Header />
      <main className="container py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="font-heading font-bold text-4xl md:text-6xl">
              Каталог <span className="text-primary">електромобілів</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {cars?.length || 0} автомобілів у наявності та під замовлення
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Перевірена технічна історія</span>
              <TrendingUp className="h-4 w-4 text-accent ml-4" />
              <span>Найкращі ціни</span>
              <Clock className="h-4 w-4 text-success ml-4" />
              <span>Доставка 45-60 днів</span>
            </div>
          </div>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <Input
              placeholder="Пошук за брендом або моделлю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          {/* Filters */}
          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-bold text-xl">Фільтри</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Скинути
                </Button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Бренд</label>
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Мінімальний рік</label>
                <Input
                  type="number"
                  min={2015}
                  max={2025}
                  value={minYear}
                  onChange={(e) => setMinYear(parseInt(e.target.value) || 2015)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Мін. запас ходу (км)</label>
                <Input
                  type="number"
                  min={0}
                  value={minRange}
                  onChange={(e) => setMinRange(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Ціновий діапазон</label>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                min={0}
                max={100000}
                step={1000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-4"
              />
            </div>
          </Card>
          
          {/* Results */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="h-[480px] animate-pulse bg-card" />
              ))}
            </div>
          ) : cars && cars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars?.map((car, index) => {
                const badge = getStatusBadge(car.status);
                const specs = car.specs as { power_kw?: number; battery_kwh?: number; acceleration?: number };
                
                return (
                  <Card
                    key={car.id}
                    className="overflow-hidden group hover:shadow-glow transition-all duration-mid cursor-pointer animate-fade-in hover-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div 
                      className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5"
                      onClick={() => setSelectedCarId(car.id)}
                    >
                      {car.images && car.images[0] ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-mid"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Zap className="h-16 w-16 text-primary/20" />
                        </div>
                      )}
                      <Badge className="absolute top-4 right-4 shadow-lg" variant={badge.variant}>
                        {badge.label}
                      </Badge>
                      {car.status === "InStock" && (
                        <Badge className="absolute top-4 left-4 bg-success text-white shadow-lg">
                          🔥 Хіт продажів
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div onClick={() => setSelectedCarId(car.id)}>
                        <h3 className="font-heading font-bold text-2xl mb-1 group-hover:text-primary transition-colors">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {car.year} • {car.source_country}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
                        <div className="text-center space-y-1">
                          <Zap className="h-4 w-4 text-success mx-auto" />
                          <p className="text-xs font-medium">{car.range_km} км</p>
                          <p className="text-xs text-muted-foreground">Запас</p>
                        </div>
                        <div className="text-center space-y-1">
                          <Gauge className="h-4 w-4 text-accent mx-auto" />
                          <p className="text-xs font-medium">{specs.power_kw || 0} kW</p>
                          <p className="text-xs text-muted-foreground">Потужність</p>
                        </div>
                        <div className="text-center space-y-1">
                          <Clock className="h-4 w-4 text-primary mx-auto" />
                          <p className="text-xs font-medium">{car.mileage_km?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Пробіг км</p>
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between pt-2">
                        <div>
                          <div className="text-3xl font-heading font-bold text-primary">
                            ${car.price_usd.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">під ключ з доставкою</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCarId(car.id)}
                          className="w-full"
                        >
                          Детальніше
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleReserve(car.id)}
                          className="w-full"
                        >
                          Резервувати
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : !cars || cars.length === 0 ? (
            <EmptyStateCatalog />
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                Автомобілів за заданими критеріями не знайдено. Спробуйте змінити фільтри.
              </p>
              <Button onClick={resetFilters} className="mt-4">
                Скинути фільтри
              </Button>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      {selectedCarId && (
        <CarDetailModal
          carId={selectedCarId}
          open={!!selectedCarId}
          onOpenChange={(open) => !open && setSelectedCarId(null)}
          onReserve={handleReserve}
        />
      )}

      <LeadModal
        open={leadModalOpen}
        onOpenChange={setLeadModalOpen}
        carId={leadCarId}
        source="catalog"
      />
    </div>
  );
};

export default Catalog;
