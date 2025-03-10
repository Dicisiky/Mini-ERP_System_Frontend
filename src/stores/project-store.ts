import FetchProjectResponse from "@/entities/Project";
import { create } from "zustand";

interface ProjectStore {
  selectedProject: FetchProjectResponse | null;
  setSelectedProject: (Project: FetchProjectResponse | null) => void;
  clearSelectedProject: () => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  clearSelectedProject: () => set({ selectedProject: null }),
}));

export default useProjectStore;
