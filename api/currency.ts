import { useEffect, useState } from 'react';

const API_KEY = 'f9728bbc85b2fa501f494e22'; // <-- PASTE YOUR KEY HERE
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

interface ConversionRates {
  [key: string]: number;
}

interface ApiResponse {
  result: string;
  conversion_rates: ConversionRates;
}

export const useCurrencyData = (baseCurrency: string) => {
  const [rates, setRates] = useState<ConversionRates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${API_URL}/latest/${baseCurrency}`);
        const data: ApiResponse = await response.json();
        if (data.result === 'success') {
          setRates(data.conversion_rates);
        } else {
          setError('Failed to fetch currency data.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (baseCurrency) {
      fetchRates();
    }
  }, [baseCurrency]);

  return { rates, error, loading };
};

// A list of common currencies for the picker
export const CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL'];