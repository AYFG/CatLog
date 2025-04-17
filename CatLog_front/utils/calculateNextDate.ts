export const calculateNextDate = (startDate: string, cycle: string) => {
  const start = new Date(startDate);
  const today = new Date();
  const nextDate = new Date(start.setDate(start.getDate() + Number(cycle)));
  let diffInDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return diffInDays;
};
