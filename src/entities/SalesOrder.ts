import RelationType from "./Relation";

type SalesOrder = {
  salesOrderId?: number;
  customerId: Pick<RelationType, "relationid">;
  date: Date;
  totalPrice: number;
  totalPriceWithVAT: number;
};

export type FetchSalesOrderResponse = Omit<SalesOrder, "customer"> & {
  customerId: RelationType;
  state: SalesOrderState;
  salesOrderStateDescription: string;
  customerName?: string;
};

export enum SalesOrderState {
  NEW = "NEW",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
}

const SalesOrderStateDescriptions: Record<SalesOrderState, string> = {
  [SalesOrderState.NEW]: "New",
  [SalesOrderState.CANCELLED]: "Cancelled",
  [SalesOrderState.CONFIRMED]: "Confirmed",
  [SalesOrderState.SENT]: "Sent to customer",
  [SalesOrderState.DELIVERED]: "Delivered",
};

export const salesOrderStateOptions = Object.values(SalesOrderState).map(
  (value) => ({
    value,
    label: SalesOrderStateDescriptions[value],
  })
);

export default SalesOrder;
