import { create } from "zustand";
import RelationType from "@/entities/Relation";

interface RelationStore {
  selectedRelation: RelationType | null;
  setSelectedRelation: (relation: RelationType | null) => void;
  clearSelectedRelation: () => void;
}

const useRelationStore = create<RelationStore>((set) => ({
  selectedRelation: null,
  setSelectedRelation: (relation) => set({ selectedRelation: relation }),
  clearSelectedRelation: () => set({ selectedRelation: null }),
}));

export default useRelationStore;
