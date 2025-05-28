import { MedicalLogData } from "./medicalLog";

export interface CatData {
  _id?: string;
  name: string;
  birthDate: string;
  owner: string;
  medicalLogs?: MedicalLogData;
}
