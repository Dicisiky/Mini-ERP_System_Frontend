enum UMTypes {
  PIECES = "PIECES",
  KILOGRAMS = "KILOGRAMS",
  LITERS = "LITERS",
  METERS = "METERS",
  SQUARE_METERS = " SQUARE_METERS",
  CUBIC_METERS = "CUBIC_METERS",
  TONS = "TONS",
}

export enum PenaltyTypes {
  LP = "LATE_PAYMENT",
  LR = "LATE_RETURN",
  LA = "LOST_ARTICLE",
}

const UMTypeDescriptions: Record<UMTypes, string> = {
  [UMTypes.PIECES]: "Pieces",
  [UMTypes.KILOGRAMS]: "Kilograms",
  [UMTypes.LITERS]: "Liters",
  [UMTypes.METERS]: "Meters",
  [UMTypes.SQUARE_METERS]: "Square Meters",
  [UMTypes.CUBIC_METERS]: "Cubic Meters",
  [UMTypes.TONS]: "Tons",
};

export const umTypeOptions = Object.values(UMTypes).map((value) => ({
  value,
  label: UMTypeDescriptions[value],
}));

export default UMTypes;
