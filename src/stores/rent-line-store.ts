import { create } from "zustand";
import { FetchRentLineResponse } from "@/entities/RentLine";

interface RentLineStore {
  selectedRentLine: FetchRentLineResponse | null;
  setSelectedRentLine: (rent: FetchRentLineResponse | null) => void;
  clearSelectedRentLine: () => void;
}

const useRentLineStore = create<RentLineStore>((set) => ({
  selectedRentLine: null,
  setSelectedRentLine: (rentLine) => set({ selectedRentLine: rentLine }),
  clearSelectedRentLine: () => set({ selectedRentLine: null }),
}));

export default useRentLineStore;
