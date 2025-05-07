interface DailyLogData {
  _id?: string;
  cat: {
    catId: string;
    catName: string;
  };
  defecation: boolean;
  weight: string;
  vitamin: boolean;
  etc: string;
  logDate: string;
}
