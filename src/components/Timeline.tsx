import { Search, FileText, Ship, FileCheck, Package } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Підбір авто",
    duration: "1-3 дні",
    description: "Аналізуємо ринок, знаходимо оптимальні варіанти за вашими параметрами"
  },
  {
    icon: FileText,
    title: "Оплата та контракт",
    duration: "1 день",
    description: "Оформлюємо договір, отримуємо передоплату, бронюємо авто"
  },
  {
    icon: Ship,
    title: "Викуп та логістика",
    duration: "20-30 днів",
    description: "Викуп на аукціоні, перевірка, доставка морем RORO або контейнером"
  },
  {
    icon: FileCheck,
    title: "Митне очищення",
    duration: "5-7 днів",
    description: "Повне оформлення митної документації, сплата зборів"
  },
  {
    icon: Package,
    title: "Доставка та передача",
    duration: "1-2 дні",
    description: "Доставка до вашого міста, перевірка, передача ключів"
  }
];

export const Timeline = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Як отримати електромобіль?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Прозорий процес від підбору до отримання ключів. Повний цикл 30-45 днів.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/50 -translate-x-1/2" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Circle with icon */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground md:absolute md:left-1/2 md:-translate-x-1/2">
                    <step.icon className="w-8 h-8" />
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                    <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">
                          Крок {index + 1}: {step.title}
                        </h3>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
