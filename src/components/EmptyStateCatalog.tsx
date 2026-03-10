import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calculator, 
  Phone, 
  Shield, 
  CheckCircle2, 
  Clock, 
  FileText,
  Zap,
  TrendingDown,
  Award
} from "lucide-react";
import { LeadModal } from "./LeadModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const EmptyStateCatalog = () => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadType, setLeadType] = useState<"inquiry" | "calculator" | "subscription">("inquiry");
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);

  const handleSubscribe = async () => {
    if (!subscriptionEmail || !subscriptionEmail.includes("@")) {
      toast.error("Будь ласка, введіть коректну email адресу");
      return;
    }

    setIsSubmittingSubscription(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: "Підписка на надходження",
        email: subscriptionEmail,
        phone: "",
        type: "subscription",
        source: "catalog_empty_state",
        message: "Підписка на повідомлення про надходження авто"
      });

      if (error) throw error;

      toast.success("Дякуємо! Ми повідомимо вас про надходження нових авто");
      setSubscriptionEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Помилка підписки. Спробуйте ще раз");
    } finally {
      setIsSubmittingSubscription(false);
    }
  };

  const openLeadModal = (type: "inquiry" | "calculator" | "subscription") => {
    setLeadType(type);
    setLeadModalOpen(true);
  };

  const demoModels = [
    {
      brand: "BYD",
      model: "Dolphin",
      year: "2024",
      budget: "$28,000",
      status: "Очікується",
      range: "420 км",
      image: null
    },
    {
      brand: "Tesla",
      model: "Model 3",
      year: "2023",
      budget: "$42,000",
      status: "Очікується",
      range: "510 км",
      image: null
    },
    {
      brand: "VW",
      model: "ID.4",
      year: "2024",
      budget: "$38,000",
      status: "Під замовлення",
      range: "480 км",
      image: null
    }
  ];

  const guarantees = [
    { icon: Shield, text: "Перевірка VIN та історії авто" },
    { icon: FileText, text: "Договір з фіксованими строками" },
    { icon: CheckCircle2, text: "Фото/відео до оплати" },
    { icon: Clock, text: "Доставка 45-60 днів" },
    { icon: TrendingDown, text: "Економія до 30% vs AUTO.RIA" },
    { icon: Award, text: "Гарантія якості та комплектації" }
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Hero Empty State */}
      <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Zap className="h-10 w-10 text-primary" />
        </div>
        
        <div className="space-y-3 max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl">
            Каталог тимчасово <span className="text-primary">порожній</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ми оновлюємо лінійку електромобілів та підбираємо найкращі пропозиції.
          </p>
          <p className="text-base text-muted-foreground">
            <strong>Залиште заявку</strong> — за 24 години надішлемо <strong>3 варіанти</strong> з повною калькуляцією доставки та розмитнення під ваш бюджет.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6">
          <Button 
            size="lg" 
            className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            onClick={() => openLeadModal("inquiry")}
          >
            <Phone className="h-5 w-5" />
            <span className="text-sm font-semibold">Залишити заявку на підбір</span>
            <span className="text-xs opacity-80">Відповідь за 24 год</span>
          </Button>
          
          <Button 
            size="lg" 
            variant="secondary"
            className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            onClick={() => openLeadModal("calculator")}
          >
            <Calculator className="h-5 w-5" />
            <span className="text-sm font-semibold">Калькуляція імпорту</span>
            <span className="text-xs opacity-80">Повна вартість під ключ</span>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            onClick={() => openLeadModal("subscription")}
          >
            <Bell className="h-5 w-5" />
            <span className="text-sm font-semibold">Підписатись на надходження</span>
            <span className="text-xs opacity-80">Першими дізнаєтесь про авто</span>
          </Button>
        </div>

        {/* Quick Subscription */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Ваш email для сповіщень"
              value={subscriptionEmail}
              onChange={(e) => setSubscriptionEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSubscribe}
              disabled={isSubmittingSubscription}
            >
              {isSubmittingSubscription ? "Підписуємо..." : "Підписатись"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Demo Models */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-heading font-bold text-2xl md:text-3xl">
            Популярні моделі <span className="text-accent">очікуються</span>
          </h3>
          <p className="text-muted-foreground">
            Орієнтовні бюджети "під ключ" з доставкою та розмитненням
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {demoModels.map((model, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-glow transition-all duration-mid">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                <Zap className="h-16 w-16 text-primary/30" />
                <Badge className="absolute top-4 right-4" variant="outline">
                  {model.status}
                </Badge>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-xl">
                    {model.brand} {model.model}
                  </h4>
                  <p className="text-sm text-muted-foreground">{model.year}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-success" />
                    {model.range}
                  </span>
                  <span className="text-muted-foreground">Запас ходу</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-2xl font-heading font-bold text-primary">
                    {model.budget}
                  </div>
                  <div className="text-xs text-muted-foreground">орієнтовно під ключ</div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => openLeadModal("inquiry")}
                >
                  Отримати розрахунок
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Block */}
      <Card className="p-8 md:p-12 bg-gradient-to-br from-success/5 to-primary/5">
        <div className="text-center space-y-4 mb-8">
          <h3 className="font-heading font-bold text-2xl md:text-3xl">
            Гарантії та <span className="text-success">прозорість</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ми працюємо за договором з фіксацією строків та бюджету. Повна юридична підтримка на всіх етапах.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guarantees.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-success" />
              </div>
              <p className="text-sm font-medium pt-2">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-lg bg-background/80 border border-primary/20">
          <h4 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Прозора угода
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Договір включає: терміни підбору (3-7 днів), доставки (45-60 днів), розмитнення (5-10 днів). 
            Передоплата 30%, решта після огляду та перевірки авто. Штрафні умови за порушення строків. 
            Гарантія повернення коштів якщо авто не відповідає заявленим характеристикам.
          </p>
        </div>
      </Card>

      {/* SEO Content Block */}
      <Card className="p-8 md:p-12">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6">
            Підбір та імпорт електромобілів в Україну
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>CarHunter™</strong> — професійний сервіс підбору електромобілів з Китаю, США та Європи. 
              Ми допомагаємо заощадити до 30% порівняно з цінами AUTO.RIA завдяки прямому імпорту та оптимізації логістики.
            </p>
            
            <p>
              <strong>Чому обирають нас:</strong> повна перевірка VIN та технічного стану, фіксація бюджету до митниці, 
              юридичний супровід, страхування ризиків. Працюємо з електромобілями та гібридами всіх класів — від компактних 
              міських до преміум седанів та кросоверів.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6 not-prose">
              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Процес роботи</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Консультація та визначення потреб (безкоштовно)</li>
                  <li>2. Підбір 3-5 варіантів з розрахунком вартості</li>
                  <li>3. Перевірка технічного стану та історії</li>
                  <li>4. Договір і передоплата 30%</li>
                  <li>5. Купівля, логістика та митниця</li>
                  <li>6. Доставка та передача авто в Україні</li>
                </ol>
              </div>

              <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
                <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Що входить у вартість</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Підбір та перевірка авто</li>
                  <li>✓ Купівля на аукціоні або у дилера</li>
                  <li>✓ Доставка морем або контейнером</li>
                  <li>✓ Розмитнення та сплата всіх зборів</li>
                  <li>✓ Українізація (сертифікація)</li>
                  <li>✓ Реєстрація та постановка на облік</li>
                </ul>
              </div>
            </div>

            <p>
              <strong>Популярні напрямки:</strong> імпорт EV з Китаю (BYD, NIO, XPeng, Li Auto), 
              з США (Tesla, Rivian, Ford Mustang Mach-E), з Європи (VW ID серія, BMW iX, Mercedes EQ). 
              Допомагаємо з вибором під будь-який бюджет — від $25,000 до $100,000+.
            </p>

            <p>
              <strong>Терміни та гарантії:</strong> стандартна доставка 45-60 днів з моменту знаходження авто. 
              Експрес-доставка авіа можлива за 14-21 день. Гарантуємо юридичну чистоту, технічну справність, 
              відповідність заявленій комплектації. Супроводжуємо до моменту реєстрації в Україні.
            </p>
          </div>
        </article>
      </Card>

      <LeadModal
        open={leadModalOpen}
        onOpenChange={setLeadModalOpen}
        source={`catalog_empty_${leadType}`}
      />
    </div>
  );
};