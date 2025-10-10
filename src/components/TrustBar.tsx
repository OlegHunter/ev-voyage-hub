import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const TrustBar = () => {
  const [stats, setStats] = useState({
    cars_delivered: 6500,
    service_centers: 10,
    satisfaction: 98
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("stats_counters").select("key, value");
      if (data) {
        const statsObj = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);
        setStats(prev => ({ ...prev, ...statsObj }));
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-12 bg-background/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold font-heading text-primary">
              {stats.cars_delivered}+
            </div>
            <p className="text-muted-foreground">Доставлено авто</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold font-heading text-accent">
              {stats.service_centers}+
            </div>
            <p className="text-muted-foreground">Сервісних центрів</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold font-heading text-success">
              {stats.satisfaction}%
            </div>
            <p className="text-muted-foreground">Задоволених клієнтів</p>
          </div>
        </div>
      </div>
    </section>
  );
};
