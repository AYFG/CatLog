import { CatData } from "@/types/cat";
import { create } from "zustand";

interface CatState {
  cats: CatData[];
  setCats: (cats: CatData[]) => void;
  addCat: (cat: CatData) => void;
  updateCat: (id: string, cat: Partial<CatData>) => void;
  removeCat: (id: string) => void;
}

export const useCatStore = create<CatState>((set) => ({
  cats: [],
  setCats: (cats) => set({ cats }),
  addCat: (cat) => set((state) => ({ cats: [...state.cats, cat] })),
  updateCat: (id, updatedCat) =>
    set((state) => ({
      cats: state.cats.map((cat) => (cat.id === id ? { ...cat, ...updatedCat } : cat)),
    })),
  removeCat: (id) =>
    set((state) => ({
      cats: state.cats.filter((cat) => cat.id !== id),
    })),
}));

