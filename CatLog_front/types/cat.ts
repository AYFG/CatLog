import { MedicalLogData } from "./medicalLog";

export interface CatData {
  _id?: string;
  name: string;
  catType?: string;
  birthDate: string;
  owner: string;
  medicalLogs?: MedicalLogData;
}
