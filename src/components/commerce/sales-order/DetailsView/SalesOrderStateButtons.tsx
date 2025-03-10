import DeleteDialog from "@/components/partials/DeleteDialog";
import StateChangeButton from "@/components/partials/StateChangeButton";
import { Button } from "@/components/ui/button";
import {
  FetchSalesOrderResponse,
  SalesOrderState,
} from "@/entities/SalesOrder";
import { FetchSalesOrderLineResponse } from "@/entities/SalesOrderLine";
import Stock from "@/entities/Stock";
import useSalesOrdersLines from "@/hooks/use-sales-orders-lines";
import ApiClient from "@/services/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface SalesOrderStateButtonsProps {
  salesOrderId: number;
  salesOrderState: SalesOrderState;
}

const SalesOrderStateButtons = ({
  salesOrderId,
  salesOrderState,
}: SalesOrderStateButtonsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const { data: salesOrderLines } = useSalesOrdersLines(salesOrderId);

  const handleSuccessConfirm = async () => {
    toast.success(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        was succesfully confirmed.
      </span>
    );

    if (!salesOrderLines) return;

    await updateStock(salesOrderLines, "soldQuantity");
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorConfirm = () =>
    toast.warning(
      <span>
        Not enough stock available for sales order
        <span className="font-semibold"> {salesOrderId}. </span>
      </span>
    );

  const handleSuccessSent = () =>
    toast.success(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        was succesfully sent.
      </span>
    );

  const handleErrorSent = () =>
    toast.error(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        could not be sent.
      </span>
    );

  const handleSuccessDelivered = () => {
    toast.success(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        was succesfully delivered.
      </span>
    );
  };

  const handleErrorDelivered = () =>
    toast.error(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        could not be delivered.
      </span>
    );

  const handleSuccessCancel = async () => {
    toast.success(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        was succesfully cancelled.
      </span>
    );
    salesOrderLines &&
      (await updateStock(salesOrderLines, "availableQuantity"));
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorCancel = () =>
    toast.error(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        could not be cancelled.
      </span>
    );

  const handleSuccessDelete = () => {
    toast.success(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        was succesfully deleted.
      </span>
    );
  };

  const handleErrorDelete = () => {
    toast.error(
      <span>
        Sales order
        <span className="font-semibold"> {salesOrderId} </span>
        could not be deleted.
      </span>
    );
  };

  const updateStock = async (
    salesOrderLines: FetchSalesOrderLineResponse[],
    operation: keyof Pick<
      Stock,
      | "rentedQuantity"
      | "receivedQuantity"
      | "returnedQuantity"
      | "incomingQuantity"
      | "availableQuantity"
      | "soldQuantity"
    >
  ): Promise<void> => {
    const apiClient = new ApiClient<Stock>("/stocks/update");
    for (const line of salesOrderLines) {
      console.log(line.article.articleid);
      await apiClient.update(Number(line.article.articleid), {
        [operation]: line.quantity,
      });
    }
  };

  return (
    <div className="inline-flex flex-col gap-2 w-full md:w-1/4 lg:w-1/6">
      {salesOrderState === SalesOrderState.NEW && (
        <StateChangeButton<FetchSalesOrderResponse>
          disabled={salesOrderLines?.length === 0}
          endpoint="/sales-orders/confirm"
          itemId={salesOrderId}
          title="Set status to confirmed"
          buttonText="Confirm sales order"
          queryKeys={[
            ["sales-order"],
            ["sales-orders"],
            ["sales-orders-new"],
            ["sales-orders-lines"],
            ["sales-order-line"],
          ]}
          onSuccess={handleSuccessConfirm}
          onError={handleErrorConfirm}
        />
      )}

      {salesOrderState === SalesOrderState.CONFIRMED && (
        <StateChangeButton<FetchSalesOrderResponse>
          endpoint="/sales-orders/send"
          itemId={salesOrderId}
          title="Set status to sent to customer"
          buttonText="Send to customer"
          queryKeys={[
            ["sales-order"],
            ["sales-orders"],
            ["sales-orders-new"],
            ["sales-orders-lines"],
            ["sales-order-line"],
          ]}
          onSuccess={handleSuccessSent}
          onError={handleErrorSent}
        />
      )}

      {salesOrderState === SalesOrderState.SENT && (
        <StateChangeButton<FetchSalesOrderResponse>
          endpoint="/sales-orders/deliver"
          itemId={salesOrderId}
          title="Set status to delivered"
          buttonText="Deliver sales order"
          queryKeys={[
            ["sales-order"],
            ["sales-orders"],
            ["sales-orders-new"],
            ["sales-orders-lines"],
            ["sales-order-line"],
          ]}
          onSuccess={handleSuccessDelivered}
          onError={handleErrorDelivered}
        />
      )}

      {(salesOrderState === SalesOrderState.NEW ||
        salesOrderState === SalesOrderState.CONFIRMED) && (
        <StateChangeButton<FetchSalesOrderResponse>
          variant="outline"
          endpoint="/sales-orders/cancel"
          itemId={salesOrderId}
          title="Set status to cancelled"
          buttonText="Cancel sales order"
          queryKeys={[
            ["sales-order"],
            ["sales-orders"],
            ["sales-orders-new"],
            ["sales-orders-lines"],
            ["sales-order-line"],
          ]}
          onSuccess={handleSuccessCancel}
          onError={handleErrorCancel}
        />
      )}

      {salesOrderState === SalesOrderState.NEW && (
        <Button
          onClick={() => navigate(`/sales-orders/update/${salesOrderId}`)}
          title="Edit sales order"
          variant="outline"
        >
          <PenIcon /> Edit
        </Button>
      )}
      {(salesOrderState === SalesOrderState.NEW ||
        salesOrderState === SalesOrderState.DELIVERED ||
        salesOrderState === SalesOrderState.CANCELLED) && (
        <Button
          onClick={() => setDeleteOpen(true)}
          title="Delete sales order"
          variant="destructive"
        >
          <TrashIcon /> Delete
        </Button>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          queryKeys={[
            ["sales-orders"],
            ["sales-orders-new"],
            ["sales-orders-lines"],
            ["sales-order-line"],
          ]}
          removeQueryKeys={[
            ["sales-order", `${salesOrderId}`],
            ["sales-orders-lines", `${salesOrderId}`],
          ]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          endpoint={`/sales-orders/${salesOrderId}`}
          redirectPath="/sales-orders/all"
          onSuccess={handleSuccessDelete}
          onError={handleErrorDelete}
        />
      )}
    </div>
  );
};

export default SalesOrderStateButtons;
