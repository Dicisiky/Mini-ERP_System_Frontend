import RelationType from "./Relation";
import ProjectType from "./Project";

type PurchaseOrder = {
  purchaseOrderId?: number;
  supplierId: Pick<RelationType, "relationid">;
  projectId: Pick<ProjectType, "projectId">;
  date: Date;
  totalPrice: number;
  totalPriceWithVAT: number;
  purchaseOrderLines?: Array<PurchaseOrderLine>;
};

type PurchaseOrderLine = {
  lineId?: number;
  productId: number;
  quantity: number;
  price: number;
  priceWithVAT: number;
};

export type FetchPurchaseOrderResponse = Omit<
  PurchaseOrder,
  "supplierId" | "projectId"
> & {
  supplierId: RelationType;
  projectId: ProjectType;
  state: PurchaseOrderState;
  purchaseOrderStateDescription: string;
  supplierName?: string;
  projectName?: string;
};

export enum PurchaseOrderState {
  NEW = "NEW",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  SENT = "SENT",
  RECEIVED = "RECEIVED",
}

const PurchaseOrderStateDescriptions: Record<PurchaseOrderState, string> = {
  [PurchaseOrderState.NEW]: "New",
  [PurchaseOrderState.CONFIRMED]: "Confirmed",
  [PurchaseOrderState.CANCELLED]: "Cancelled",
  [PurchaseOrderState.SENT]: "Sent to supplier",
  [PurchaseOrderState.RECEIVED]: "Received",
};

export const purchaseOrderStateOptions = Object.values(PurchaseOrderState).map(
  (value) => ({
    value,
    label: PurchaseOrderStateDescriptions[value],
  })
);

export default PurchaseOrder;
