export interface MedicalLogData {
  _id?: string;
  healthCheckupDate: string;
  healthCycle: string;
  heartWorm: string;
  heartWormCycle: string;
  cat: {
    catId: string;
    catName: string;
  };
}
