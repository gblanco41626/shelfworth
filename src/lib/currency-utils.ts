import type { Purchase } from '@/types';

export const formatCurrency = (amount: number) => {
  const fmt = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });

  return isNaN(amount) ? '' : fmt.format(amount);
};

export const pricePerUnit = (p: Partial<Purchase>) => {
  const amount = p.amount || 0;
  const price = p.price || 0;

  return amount ? price / amount : price;
};

export const totalPrice = (p: Partial<Purchase>) => {
  const amount = p.amount || 0;
  const price = p.price || 0;

  return amount * price;
};
