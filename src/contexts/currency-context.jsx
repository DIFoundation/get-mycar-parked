'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Currency symbols and names mapping
const currencyInfo = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
};

// Initialize with USD only for immediate rendering
const initialRates = {
  USD: { ...currencyInfo.USD, rate: 1 }
};

// Fetch exchange rates from API
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    // Combine currency info with API rates
    return Object.keys(currencyInfo).reduce((acc, currency) => {
      acc[currency] = {
        ...currencyInfo[currency],
        rate: currency === 'USD' ? 1 : data.rates[currency],
      };
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return initialRates;
  }
};

const CurrencyContext = createContext();

// Currency Provider component
export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(initialRates);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        if (rates) {
          setExchangeRates(rates);
        }
      } catch (err) {
        console.error('Error loading exchange rates:', err);
      }
    };

    loadExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(loadExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (priceInUSD) => {
    if (!exchangeRates || !exchangeRates[selectedCurrency]) {
      return priceInUSD;
    }
    return priceInUSD * exchangeRates[selectedCurrency].rate;
  };

  const formatPrice = (priceInUSD) => {
    if (!exchangeRates || !exchangeRates[selectedCurrency]) {
      return `$${priceInUSD.toFixed(2)}`;
    }
    
    const convertedPrice = convertPrice(priceInUSD);
    const { symbol } = exchangeRates[selectedCurrency];
    
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  const value = {
    selectedCurrency,
    setSelectedCurrency,
    currencies: exchangeRates,
    convertPrice,
    formatPrice
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
