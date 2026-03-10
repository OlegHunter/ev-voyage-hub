import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { executeCalculatorFormula, formatCurrency } from "@/lib/calculators";
import { trackCalculatorUse, trackCalculatorResult } from "@/lib/analytics";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CustomsCalculator = () => {
  const [vehiclePrice, setVehiclePrice] = useState(30000);
  const [year, setYear] = useState(2023);
  const [vehicleType, setVehicleType] = useState("electric");
  const [engineVolume, setEngineVolume] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [formula, setFormula] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchFormula = async () => {
      const { data } = await (supabase as any)
        .from("calculator_configs")
        .select("formula_js")
        .eq("calculator_type", "customs_clearance")
        .limit(1);

      if (data && data[0]) {
        setFormula(data[0].formula_js as string);
      }
    };
    fetchFormula();
  }, []);

  const calculate = () => {
    if (!formula) {
      toast({ title: "Калькулятор завантажується...", variant: "destructive" });
      return;
    }

    setIsCalculating(true);
    trackCalculatorUse('customs_clearance');

    try {
      const params = {
        vehiclePrice,
        year,
        type: vehicleType,
        engineVolume: vehicleType === "hybrid" || vehicleType === "petrol" ? engineVolume : 0
      };

      const calculationResult = executeCalculatorFormula(formula, params);
      setResult(calculationResult);

      trackCalculatorResult({
        calculator_type: 'customs_clearance',
        vehicle_price: vehiclePrice
      });

      toast({ title: "Розрахунок виконано успішно!" });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({ title: "Помилка розрахунку", description: String(error), variant: "destructive" });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10" data-testid="customs-calculator">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Калькулятор розмитнення
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Розрахуйте вартість розмитнення електромобіля. Оцінка займає 30 секунд.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Параметри авто
              </CardTitle>
              <CardDescription>Введіть дані для розрахунку</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vehiclePrice">Вартість авто (USD)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="vehiclePrice"
                    min={5000}
                    max={150000}
                    step={1000}
                    value={[vehiclePrice]}
                    onValueChange={(value) => setVehiclePrice(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Рік випуску</Label>
                <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 16 }, (_, i) => 2025 - i).map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Тип авто</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric">Електромобіль</SelectItem>
                    <SelectItem value="hybrid">Гібрид</SelectItem>
                    <SelectItem value="petrol">ДВЗ (бензин)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(vehicleType === "hybrid" || vehicleType === "petrol") && (
                <div className="space-y-2">
                  <Label htmlFor="engineVolume">Обʼєм двигуна (л)</Label>
                  <Input
                    id="engineVolume"
                    type="number"
                    step="0.1"
                    min="0"
                    max="6"
                    value={engineVolume}
                    onChange={(e) => setEngineVolume(Number(e.target.value))}
                  />
                </div>
              )}

              <Button onClick={calculate} className="w-full" disabled={isCalculating}>
                <Calculator className="w-4 h-4 mr-2" />
                {isCalculating ? "Розраховую..." : "Розрахувати"}
              </Button>
            </CardContent>
          </Card>

          {/* Right: Results */}
          <Card className={result ? "border-primary" : ""} data-testid="calculator-result">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Результат розрахунку
              </CardTitle>
              <CardDescription>
                {result ? "Орієнтовні витрати на розмитнення" : "Заповніть форму для розрахунку"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Митний збір:</span>
                      <span className="font-semibold">{formatCurrency(result.customsFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Акцизний збір:</span>
                      <span className="font-semibold">{formatCurrency(result.exciseTax)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ПДВ (20%):</span>
                      <span className="font-semibold">{formatCurrency(result.vat)}</span>
                    </div>
                    <div className="h-px bg-border my-4" />
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold">Загальна сума:</span>
                      <span className="font-bold text-primary text-2xl">
                        {formatCurrency(result.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Пільги до 31.12.2025</p>
                        <p className="text-muted-foreground">
                          Для електромобілів діють знижені ставки мита. Не гаємо часу!
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Отримати детальний розрахунок на email
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Введіть параметри авто та натисніть "Розрахувати"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
