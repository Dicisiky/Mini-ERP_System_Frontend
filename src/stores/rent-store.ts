import { create } from "zustand";
import { FetchRentResponse } from "@/entities/Rent";

interface RentStore {
  selectedRent: FetchRentResponse | null;
  setSelectedRent: (rent: FetchRentResponse | null) => void;
  clearSelectedRent: () => void;
}

const useRentStore = create<RentStore>((set) => ({
  selectedRent: null,
  setSelectedRent: (rent) => set({ selectedRent: rent }),
  clearSelectedRent: () => set({ selectedRent: null }),
}));

export default useRentStore;
