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
import useSalesOrderStore from "@/stores/sales-order-store";
import { FetchSalesOrderResponse } from "@/entities/SalesOrder";
import LookupSalesOrderColumns from "./LookupSalesOrderColumns";
import useNewSalesOrders from "@/hooks/use-new-sales-orders";

interface LookupSalesOrderDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupSalesOrderDialog = ({
  open,
  setOpen,
}: LookupSalesOrderDialogProps) => {
  const { data: salesOrders, error, isLoading } = useNewSalesOrders();
  const { selectedSalesOrder, setSelectedSalesOrder } = useSalesOrderStore();

  const [originalSalesOrder, setOriginalSalesOrder] =
    useState<FetchSalesOrderResponse | null>(null);

  useEffect(() => {
    if (open) {
      setOriginalSalesOrder(selectedSalesOrder);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedSalesOrder(originalSalesOrder);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[50%] max-w-6xl max-h-[80vh] md:max-h-max overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">Sales Orders</DialogTitle>
          <DialogDescription>
            Choose a sales order from the list
          </DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && salesOrders && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["customerName"]}
              filterTextPlaceholders={["Search by customer name..."]}
              columns={LookupSalesOrderColumns}
              data={salesOrders}
              rowSelection={selectedSalesOrder}
              setRowSelection={setSelectedSalesOrder}
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

export default LookupSalesOrderDialog;
