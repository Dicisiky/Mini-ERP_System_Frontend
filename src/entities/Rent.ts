import RelationType from "./Relation";

type Rent = {
  rentId?: number;
  customer: Pick<RelationType, "relationid">;
  startDate: Date;
  endDate: Date;
};

export type FetchRentResponse = Omit<Rent, "customer"> & {
  customer: RelationType;
  totalPrice: number;
  totalPriceWithVAT: number;
  totalPriceWithPenalties: number;
  period: number;
  customerName?: string;
  state: RentState;
  rentStateDescription: string;
};

export enum RentState {
  NEW = "NEW",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  SENT = "SENT",
  RETURNED = "RETURNED",
}

const RentStateDescriptions: Record<RentState, string> = {
  [RentState.NEW]: "New",
  [RentState.CONFIRMED]: "Confirmed",
  [RentState.SENT]: "Sent to customer",
  [RentState.RETURNED]: "Returned",
  [RentState.CANCELLED]: "Cancelled",
};

export const rentStateOptions = Object.values(RentState).map((value) => ({
  value,
  label: RentStateDescriptions[value],
}));

export default Rent;
