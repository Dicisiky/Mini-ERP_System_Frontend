type Penalty = {
  penaltyid?: number;
  description: string;
  penaltytype: PenaltyTypes;
  price: number;
  penaltyTypeDescription?: string;
};

export enum PenaltyTypes {
  LP = "LATE_PAYMENT",
  LR = "LATE_RETURN",
  LA = "LOST_ARTICLE",
}

const PenaltyTypeDescriptions: Record<PenaltyTypes, string> = {
  [PenaltyTypes.LP]: "Late payment",
  [PenaltyTypes.LR]: "Late return",
  [PenaltyTypes.LA]: "Lost article",
};

export const penaltyTypeOptions = Object.values(PenaltyTypes).map((value) => ({
  value,
  label: PenaltyTypeDescriptions[value],
}));

export default Penalty;
