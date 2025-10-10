import { Clock, TrendingDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhyNow = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-background/50">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-4xl md:text-5xl">
              Чому <span className="text-primary">зараз</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Скористайтеся пільгами до кінця 2025 року
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-lg bg-card border border-primary/20 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl">До 31.12.2025</h3>
              <p className="text-sm text-muted-foreground">
                Знижені митні ставки на електромобілі — економія до €5000
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-accent/20 space-y-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <TrendingDown className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl">Низькі ціни</h3>
              <p className="text-sm text-muted-foreground">
                Стабілізація ринку в Китаї — найвигідніші ціни за 3 роки
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-success/20 space-y-4">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-heading font-bold text-xl">Швидка доставка</h3>
              <p className="text-sm text-muted-foreground">
                Прямі маршрути з портів Китаю — 45-60 днів до вашого міста
              </p>
            </div>
          </div>

          <Button size="lg" className="mt-8">
            Розрахувати вигоду
          </Button>
        </div>
      </div>
    </section>
  );
};
