import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, RefreshCw, ArrowRight } from "lucide-react";

const options = [
  {
    icon: CreditCard,
    title: "Кредит від 7.5% річних",
    description: "Термін до 7 років, аванс від 0%",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "Лізинг без першого внеску",
    description: "Фінансовий та оперативний лізинг",
    color: "text-green-500"
  },
  {
    icon: RefreshCw,
    title: "Трейд-ін: оцінка за 15 хвилин",
    description: "Обміняйте своє авто на нове",
    color: "text-purple-500"
  }
];

export const FinancingTeaser = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Фінансування покупки
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Різні варіанти оплати: від готівки до кредиту. Підберемо оптимальне рішення.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {options.map((option, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${option.color}`}>
                    <option.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/financing">
              Розрахувати фінансування
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
