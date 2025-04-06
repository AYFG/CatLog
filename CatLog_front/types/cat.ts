interface CatData {
  _id?: string;
  name: string;
  birthDate: string;
  owner: string;
  medicalLogs?: MedicalLog;
}
interface MedicalLog {
  _id: string;
  healthCheckupDate: string;
  healthCycle: string;
  heartWorm: string;
  heartWormCycle: string;
  cat: {
    catId: string;
    catName: string;
  };
}
