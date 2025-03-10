import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder"; // assuming this import path
import { create } from "zustand";

interface PurchaseOrderStore {
  purchaseOrders: FetchPurchaseOrderResponse[];
  selectedPurchaseOrder: FetchPurchaseOrderResponse | null;
  setPurchaseOrders: (purchaseOrders: FetchPurchaseOrderResponse[]) => void;
  setSelectedPurchaseOrder: (purchaseOrder: FetchPurchaseOrderResponse | null) => void;
  clearSelectedPurchaseOrder: () => void;
}

const usePurchaseOrderStore = create<PurchaseOrderStore>((set) => ({
  purchaseOrders: [],
  selectedPurchaseOrder: null,
  setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),
  setSelectedPurchaseOrder: (purchaseOrder) => set({ selectedPurchaseOrder: purchaseOrder }),
  clearSelectedPurchaseOrder: () => set({ selectedPurchaseOrder: null }),
}));

export default usePurchaseOrderStore;
