// Calculator functions that execute formulas from database

interface CalculatorParams {
  [key: string]: number | string;
}

interface CalculatorResult {
  [key: string]: number | string;
}

export const executeCalculatorFormula = (
  formulaJs: string,
  params: CalculatorParams
): CalculatorResult => {
  try {
    // Create a safe function from the formula
    const calculatorFunction = new Function('params', formulaJs);
    const result = calculatorFunction(params);
    return result;
  } catch (error) {
    console.error('Error executing calculator formula:', error);
    throw new Error('Failed to calculate. Please check your inputs.');
  }
};

// Helper to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to convert currency
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: { usd_to_uah: number; eur_to_uah: number }
): number => {
  if (fromCurrency === toCurrency) return amount;

  // Convert to UAH first
  let amountInUAH = amount;
  if (fromCurrency === 'USD') {
    amountInUAH = amount * rates.usd_to_uah;
  } else if (fromCurrency === 'EUR') {
    amountInUAH = amount * rates.eur_to_uah;
  }

  // Convert from UAH to target currency
  if (toCurrency === 'USD') {
    return amountInUAH / rates.usd_to_uah;
  } else if (toCurrency === 'EUR') {
    return amountInUAH / rates.eur_to_uah;
  }

  return amountInUAH;
};
