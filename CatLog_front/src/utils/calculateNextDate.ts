export const calculateNextDate = (lastDate: string, cycle: number): number => {
  const last = new Date(lastDate);
  const next = new Date(last);
  next.setMonth(next.getMonth() + cycle);

  const today = new Date();
  const diffTime = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

