import type { Purchase, PurchaseWithRelations, CreatePurchaseData } from "@/types";

export const formatCurrency = (amount: number) => {
  const fmt = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

  return isNaN(amount) ? "" : fmt.format(amount)
};


export const pricePerUnit = (p: Purchase | PurchaseWithRelations | CreatePurchaseData) => (
  p.amount ? p.price / (p.amount) : p.price
);
