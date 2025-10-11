import { Target, CheckCircle, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "7+ років досвіду",
    value: "6500+",
    description: "авто успішно доставлено",
    color: "text-primary"
  },
  {
    icon: CheckCircle,
    title: "Повна юридична підтримка",
    value: "100%",
    description: "легальність та прозорість",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Доставка за 45 днів",
    value: "30-45",
    description: "днів від замовлення до отримання",
    color: "text-amber-500"
  },
  {
    icon: Shield,
    title: "Гарантія 3 роки",
    value: "80 000",
    description: "км гарантійний пробіг",
    color: "text-blue-500"
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Чому обирають CarHunter?
          </h2>
          <p className="text-muted-foreground text-lg">
            Довіра, надійність та професіоналізм на кожному етапі
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg hover:scale-105 transition-all">
              <CardContent className="pt-6 text-center">
                <div className={`w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <div className={`text-4xl font-bold mb-2 ${feature.color}`}>
                  {feature.value}
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
