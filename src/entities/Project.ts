import RelationType from "./Relation";

type Project = {
  projectId?: number;
  customerId: Pick<RelationType, "relationid">;
  startDate: Date;
  endDate: Date;
  projectType: ProjectType;
  budget: number;
  isInBudget: boolean;
};

export type FetchProjectResponse = Omit<Project, "customerId"> & {
  customerId: RelationType;
  projectTypeDescription?: string;
  customerName?: string;
};

export enum ProjectType {
  R = "RESIDENTIAL",
  C = "COMERCIAL",
  IN = "INTERNAL",
  I = "INDUSTRIAL",
}

const ProjectTypeDescriptions: Record<ProjectType, string> = {
  [ProjectType.I]: "Industrial",
  [ProjectType.C]: "Comercial",
  [ProjectType.R]: "Residential",
  [ProjectType.IN]: "Internal",
};

export const projectTypeOptions = Object.values(ProjectType).map((value) => ({
  value,
  label: ProjectTypeDescriptions[value],
}));

export default Project;
