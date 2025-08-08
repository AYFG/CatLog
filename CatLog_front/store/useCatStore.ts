import { CatData } from "@/types/cat";
import { create } from "zustand";

interface CatState {
  cats: CatData[];
  setCats: (cats: CatData[]) => void;
}

export const useCatStore = create<CatState>((set) => ({
  cats: [],
  setCats: (cats) => set({ cats }),
}));

interface CatTypeState {
  catType: string;
  setCatType: (type: string) => void;
}

export const useCatTypeStore = create<CatTypeState>((set) => ({
  catType: "WhiteCat",
  setCatType: (catType: string) => set({ catType }),
}));
