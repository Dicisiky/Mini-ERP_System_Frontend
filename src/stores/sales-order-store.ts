import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import { create } from "zustand";

    interface SalesOrderStore {
  salesOrders: FetchSalesOrderResponse[];
  selectedSalesOrder: FetchSalesOrderResponse | null;
  setSalesOrders: (salesOrders: FetchSalesOrderResponse[]) => void;
  setSelectedSalesOrder: (salesOrder: FetchSalesOrderResponse | null) => void;
  clearSelectedSalesOrder: () => void;
}

const useSalesOrderStore = create<SalesOrderStore>((set) => ({
  salesOrders: [],
  selectedSalesOrder: null,
  setSalesOrders: (salesOrders) => set({ salesOrders }),
  setSelectedSalesOrder: (salesOrder) => set({ selectedSalesOrder: salesOrder }),
  clearSelectedSalesOrder: () => set({ selectedSalesOrder: null }),
}));
export default useSalesOrderStore;
