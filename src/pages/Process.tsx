import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Вибір автомобіля",
    description: "Підбираємо оптимальний варіант з каталогу або знаходимо на аукціонах Китаю",
    duration: "1-2 дні"
  },
  {
    number: 2,
    title: "Оплата та договір",
    description: "Підписання договору, внесення передоплати, страхування вантажу",
    duration: "1 день"
  },
  {
    number: 3,
    title: "Перевірка та закупівля",
    description: "Технічна інспекція, викуп на аукціоні, підготовка до відправки",
    duration: "7-10 днів"
  },
  {
    number: 4,
    title: "Логістика",
    description: "Доставка RORO/контейнером, трекінг у реальному часі",
    duration: "25-30 днів"
  },
  {
    number: 5,
    title: "Митне оформлення",
    description: "Растаможка, сплата мита та ПДВ, отримання всіх документів",
    duration: "3-5 днів"
  },
  {
    number: 6,
    title: "Передача клієнту",
    description: "Доставка в сервісний центр або за адресою, реєстрація в Україні",
    duration: "1-2 дні"
  }
];

const Process = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Процес доставки <span className="text-primary">під ключ</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              6 простих кроків від вибору до отримання вашого електромобіля
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 hidden md:flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                      {index < steps.length - 1 ? (
                        <span className="text-2xl font-heading font-bold text-primary">
                          {step.number}
                        </span>
                      ) : (
                        <CheckCircle2 className="h-8 w-8 text-secondary" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <Card className="md:ml-24 p-8 hover:shadow-glow transition-all duration-mid">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="md:hidden text-2xl font-heading font-bold text-primary">
                            {step.number}
                          </span>
                          <h3 className="font-heading font-bold text-2xl">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      <div className="text-sm font-medium text-secondary whitespace-nowrap ml-4">
                        {step.duration}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="p-8 bg-gradient-primary/10 border-primary/20">
            <div className="text-center space-y-4">
              <h3 className="font-heading font-bold text-2xl">
                Загальний термін доставки: <span className="text-secondary">40-50 днів</span>
              </h3>
              <p className="text-muted-foreground">
                Ми супроводжуємо вас на кожному етапі та надаємо регулярні оновлення статусу
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Process;