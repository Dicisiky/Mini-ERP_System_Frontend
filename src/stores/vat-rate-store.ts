import { create } from "zustand";
import VATRateType from "@/entities/VatRate";

interface VatRateStore {
  selectedVatRate: VATRateType | null;
  setSelectedVatRate: (vatrate: VATRateType | null) => void;
  clearSelectedVatRate: () => void;
}

const useVatRateStore = create<VatRateStore>((set) => ({
  selectedVatRate: null,
  setSelectedVatRate: (vatrate) => set({ selectedVatRate: vatrate }),
  clearSelectedVatRate: () => set({ selectedVatRate: null }),
}));

export default useVatRateStore;
