import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DataTable from "@/components/partials/DataTable/DataTable";
import { Navigate } from "react-router";
import Loading from "@/components/partials/Loading";
import usePurchaseOrderStore from "@/stores/purchase-order-store";
import { FetchPurchaseOrderResponse } from "@/entities/PurchaseOrder";
import LookupPurchaseOrderColumns from "./LookupPurchaseOrderColumns";
import useNewPurchaseOrders from "@/hooks/use-new-purchase-orders";

interface LookupPurchaseOrderDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupPurchaseOrderDialog = ({
  open,
  setOpen,
}: LookupPurchaseOrderDialogProps) => {
  const { data: purchaseOrders, error, isLoading } = useNewPurchaseOrders();
  const { selectedPurchaseOrder, setSelectedPurchaseOrder } =
    usePurchaseOrderStore();

  const [originalPurchaseOrder, setOriginalPurchaseOrder] =
    useState<FetchPurchaseOrderResponse | null>(null);

  useEffect(() => {
    if (open) {
      setOriginalPurchaseOrder(selectedPurchaseOrder);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedPurchaseOrder(originalPurchaseOrder);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[50%] max-w-6xl max-h-[80vh] md:max-h-max overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">Purchase Orders</DialogTitle>
          <DialogDescription>
            Choose a purchase order from the list
          </DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && purchaseOrders && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["supplierName"]}
              filterTextPlaceholders={["Search by supplier name..."]}
              columns={LookupPurchaseOrderColumns}
              data={purchaseOrders}
              rowSelection={selectedPurchaseOrder}
              setRowSelection={setSelectedPurchaseOrder}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="inline-flex gap-2 items-center"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LookupPurchaseOrderDialog;
