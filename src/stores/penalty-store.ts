import { create } from "zustand";
import Penalty from "@/entities/Penalty";

// ############# Declary the shape of the store #############
// ############# A store is like a regulare state variable #############
// ############# It can be accessed from anywhere, without the risk of prop drilling  #############
// ############# Prop drilling = the risk of making errors while passing the props to multiple components  #############
// ############# just to access the id of an object #############
interface PenaltyStore {
  // ############# the actual state, it can be an object or null #############
  selectedPenalty: Penalty | null;
  // ############# Dispatch function (change the state) #############
  setSelectedPenalty: (penalty: Penalty | null) => void;
  // ############# clean-up function (after the store's job is finished (e.g. after submitting a form) clear the store (set value to null)) #############
  clearSelectedPenalty: () => void;
}

const usePenaltyStore = create<PenaltyStore>((set) => ({
  // ############# initial state #############
  selectedPenalty: null,
  // ############# dispatch function logic #############
  setSelectedPenalty: (penalty) => set({ selectedPenalty: penalty }),
  // ############# clear function logic #############
  clearSelectedPenalty: () => set({ selectedPenalty: null }),
}));

export default usePenaltyStore;
