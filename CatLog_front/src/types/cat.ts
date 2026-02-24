import { MedicalLogData } from "./medicalLog";

export interface CatData {
  id?: string;
  name: string;
  cat_type?: string;
  birth_date: string;
  owner_id: string;
  medical_logs?: MedicalLogData;
  created_at?: string;
  updated_at?: string;
}

