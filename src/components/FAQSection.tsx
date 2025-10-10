import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Скільки коштує доставка електромобіля з Китаю?",
    answer: "Вартість доставки залежить від типу транспортування (RORO або контейнер) та порту призначення. У середньому RORO коштує $800-1200, контейнерна доставка $1500-2000. Використайте наш калькулятор для точного розрахунку."
  },
  {
    question: "Скільки часу займає весь процес?",
    answer: "Повний цикл від підбору до отримання авто займає 60-90 днів: підбір та викуп 7-14 днів, доставка морем 45-60 днів, розмитнення та реєстрація 7-14 днів."
  },
  {
    question: "Які документи потрібні для розмитнення?",
    answer: "Ми беремо на себе всю документацію: інвойс, bill of lading, сертифікат відповідності, договір купівлі-продажу. Вам потрібен лише паспорт та ІПН для оформлення."
  },
  {
    question: "Чи надаєте ви гарантію на авто?",
    answer: "Так, ми надаємо гарантію 12 місяців на батарею та основні вузли. Також доступна розширена гарантія до 3 років."
  },
  {
    question: "Чи можна отримати фінансування?",
    answer: "Так, ми співпрацюємо з провідними банками України. Можливий лізинг та кредит з першим внеском від 20%. Розрахуйте умови в нашому калькуляторі фінансування."
  },
  {
    question: "Як перевіряється технічний стан авто?",
    answer: "Кожне авто проходить детальну технічну інспекцію: діагностика батареї (SOH, цикли), перевірка кузова, електроніки, ходової частини. Надаємо фото та відео звіт."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl">
            Часті <span className="text-primary">питання</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Відповіді на найпопularніші запитання
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-white/10 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
