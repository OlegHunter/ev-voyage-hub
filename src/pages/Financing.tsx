import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp } from "lucide-react";

const Financing = () => {
  const [vehiclePrice, setVehiclePrice] = useState(45000);
  const [depositPercent, setDepositPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(8.5);
  
  const depositAmount = (vehiclePrice * depositPercent) / 100;
  const loanAmount = vehiclePrice - depositAmount;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalCost = depositAmount + (monthlyPayment * termMonths);
  const totalInterest = totalCost - vehiclePrice;
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Фінансування <span className="text-primary">електромобілів</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Гнучкі умови кредитування та лізингу від провідних банків України
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <Card className="p-8 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-6 w-6 text-primary" />
                <h2 className="font-heading font-bold text-2xl">Калькулятор фінансування</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Вартість автомобіля: ${vehiclePrice.toLocaleString()}
                  </label>
                  <Input
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(parseInt(e.target.value) || 0)}
                    min={10000}
                    max={150000}
                    step={1000}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Перший внесок: {depositPercent}% (${depositAmount.toLocaleString()})
                  </label>
                  <Slider
                    value={[depositPercent]}
                    onValueChange={([value]) => setDepositPercent(value)}
                    min={10}
                    max={50}
                    step={5}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Термін кредитування: {termMonths} місяців
                  </label>
                  <Slider
                    value={[termMonths]}
                    onValueChange={([value]) => setTermMonths(value)}
                    min={12}
                    max={60}
                    step={6}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Процентна ставка: {interestRate}% річних
                  </label>
                  <Slider
                    value={[interestRate]}
                    onValueChange={([value]) => setInterestRate(value)}
                    min={5}
                    max={15}
                    step={0.5}
                  />
                </div>
              </div>
            </Card>
            
            {/* Results */}
            <Card className="p-8 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-secondary" />
                <h2 className="font-heading font-bold text-2xl">Результати розрахунку</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-gradient-primary/10 border border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Щомісячний платіж</div>
                  <div className="text-4xl font-heading font-bold text-secondary">
                    ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Сума кредиту</div>
                    <div className="text-xl font-heading font-bold">
                      ${loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Загальна сума</div>
                    <div className="text-xl font-heading font-bold">
                      ${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Переплата</div>
                    <div className="text-xl font-heading font-bold text-accent">
                      ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Перший внесок</div>
                    <div className="text-xl font-heading font-bold">
                      ${depositAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="w-full">
                  Подати заявку на фінансування
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  * Розрахунок є орієнтовним. Остаточні умови визначаються банком після розгляду заявки.
                </p>
              </div>
            </Card>
          </div>
          
          {/* Bank partners */}
          <Card className="p-8">
            <h3 className="font-heading font-bold text-2xl mb-6">Банки-партнери</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {['ПриватБанк', 'Monobank', 'ПУМБ', 'Альфа-Банк'].map((bank) => (
                <div key={bank} className="p-6 rounded-lg bg-muted/30 text-center">
                  <div className="text-lg font-heading font-bold">{bank}</div>
                  <div className="text-sm text-muted-foreground mt-1">від 7.5% річних</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Financing;