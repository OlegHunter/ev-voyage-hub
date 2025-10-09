import { Shield, Truck, FileCheck, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Юридичний супровід",
    description: "Повне оформлення документів, митне очищення, реєстрація в Україні"
  },
  {
    icon: Truck,
    title: "Логістика під ключ",
    description: "RORO/контейнерна доставка, страхування, відстеження в реальному часі"
  },
  {
    icon: FileCheck,
    title: "Технічна інспекція",
    description: "Перевірка батареї, стан кузова, діагностика всіх систем перед відправкою"
  },
  {
    icon: Wrench,
    title: "Сервіс і гарантія",
    description: "Мережа сервісних центрів, установка зарядок, 12 місяців гарантії"
  }
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl">
            Чому <span className="text-primary">CarHunter™</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ми беремо на себе всі клопоти — від підбору авто до доставки під двері
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 hover:shadow-glow transition-all duration-mid group"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};