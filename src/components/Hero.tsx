import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
export const Hero = () => {
  return <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }} />
        </div>
      </div>
      
      {/* 3D placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[600px] h-[400px] bg-gradient-primary rounded-lg transform rotate-12 blur-sm" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container text-center space-y-8 animate-fade-in bg-sky-900">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20">
          <Zap className="h-4 w-4 text-secondary" />
          <span className="text-sm text-muted-foreground">
            Пільги до 31.12.2025 • Економія до 40%
          </span>
        </div>
        
        <h1 className="font-heading font-bold text-5xl md:text-7xl max-w-4xl mx-auto leading-tight">
          Електромобілі з Китаю
          <br />
          <span className="bg-gradient-aurora bg-clip-text text-transparent">
            під ключ в Україну
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Повний юридичний супровід, логістика RORO/контейнер, сервіс та фінансування. 
          Доставка 2015–2025 моделей за 45 днів.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/catalog">
            <Button size="lg" className="text-lg h-14 px-8">
              Переглянути каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/financing">
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 font-thin text-green-50">
              Розрахувати фінансування
            </Button>
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
          <div>
            <div className="text-3xl font-heading font-bold text-secondary">6500+</div>
            <div className="text-sm text-muted-foreground">Доставлено авто</div>
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-secondary">10+</div>
            <div className="text-sm text-muted-foreground">Сервісних центрів</div>
          </div>
          <div>
            <div className="text-3xl font-heading font-bold text-secondary">98%</div>
            <div className="text-sm text-muted-foreground">Задоволених клієнтів</div>
          </div>
        </div>
      </div>
    </section>;
};