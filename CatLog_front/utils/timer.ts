import { getData, setData } from "./storage";

export const saveTimerEndTime = async (endTime: number) => {
  await setData("TIMER_END", String(endTime));
};

export const loadRemainingTime = async (): Promise<number | null> => {
  const end = await getData("TIMER_END");
  if (!end) return null;

  const now = Date.now();
  const diff = Math.floor((Number(end) - now) / 1000);
  return diff > 0 ? diff : null;
};

export const clearTimerEndTime = async () => {
  await setData("TIMER_END", "");
};
