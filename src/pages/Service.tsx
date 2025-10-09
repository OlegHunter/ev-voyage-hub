import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, DollarSign } from "lucide-react";

const Service = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("price", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: centers } = useQuery({
    queryKey: ["service-centers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_centers")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Сервісне <span className="text-primary">обслуговування</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Професійний догляд за вашим електромобілем від сертифікованих майстрів
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h2 className="font-heading font-bold text-3xl mb-6">Наші послуги</h2>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-48 animate-pulse bg-card" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {services?.map((service) => (
                  <Card key={service.id} className="p-6 hover:shadow-glow transition-all duration-mid">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{service.duration_min} хв</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-secondary" />
                            <span className="font-bold text-secondary">${service.price}</span>
                          </div>
                        </div>
                        <Button size="sm">Записатися</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Service Centers */}
          <div>
            <h2 className="font-heading font-bold text-3xl mb-6">Сервісні центри</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {centers?.map((center) => (
                <Card key={center.id} className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-4">{center.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{center.city}, {center.address}</p>
                    <p className="text-primary font-medium">{center.phone}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Проложить маршрут
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Service;