import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Brand {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  country?: string;
}

export const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from("brands")
        .select("id, slug, name, logo_url, country")
        .order("name")
        .limit(6);

      if (data) {
        setBrands(data);
      }
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Популярні бренди
          </h2>
          <p className="text-muted-foreground text-lg">
            Працюємо з усіма провідними виробниками електромобілів
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {brands.map((brand) => (
            <Link key={brand.id} to={`/brands/${brand.slug}`}>
              <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
                <div className="aspect-square flex items-center justify-center">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="font-bold text-lg">{brand.name}</p>
                      {brand.country && (
                        <p className="text-sm text-muted-foreground">{brand.country}</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/brands">
              Всі бренди
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
