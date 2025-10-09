import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart } from "lucide-react";

const Shop = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const categories = Array.from(new Set(products?.map(p => p.category) || []));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Магазин <span className="text-primary">автотоварів</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Зарядні станції, аксесуари та обладнання для електромобілів
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(20)].map((_, i) => (
                <Card key={i} className="h-80 animate-pulse bg-card" />
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <div key={category}>
                <h2 className="font-heading font-bold text-2xl mb-6">{category}</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products?.filter(p => p.category === category).map((product) => (
                    <Card key={product.id} className="overflow-hidden group hover:shadow-glow transition-all duration-mid">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-mid"
                          />
                        )}
                        {product.stock < 5 && (
                          <Badge className="absolute top-4 right-4" variant="destructive">
                            Залишилось {product.stock}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-medium text-sm mb-1 line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-heading font-bold text-secondary">
                            ${product.price}
                          </div>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;