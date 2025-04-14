"use client";
import { useCurrency } from "@/contexts/currency-context";

export default function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

  return (
    <select
      value={selectedCurrency}
      onChange={(e) => setSelectedCurrency(e.target.value)}
      className="fixed top-4 right-16 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition shadow-md"
    >
      {Object.entries(currencies).map(([code, { name }]) => (
        <option key={code} value={code}>
          {code} - {name}
        </option>
      ))}
    </select>
  );
}
