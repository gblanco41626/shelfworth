export const formatCurrency = (amount: number | bigint) => {
  const fmt = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

  return fmt.format(amount)
};
