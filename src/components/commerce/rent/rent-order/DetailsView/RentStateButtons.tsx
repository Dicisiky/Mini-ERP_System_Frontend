import DeleteDialog from "@/components/partials/DeleteDialog";
import StateChangeButton from "@/components/partials/StateChangeButton";
import { Button } from "@/components/ui/button";
import { FetchRentResponse, RentState } from "@/entities/Rent";
import { FetchRentLineResponse } from "@/entities/RentLine";
import Stock from "@/entities/Stock";
import useRentLines from "@/hooks/use-rent-lines";
import ApiClient from "@/services/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface RentStateButtonsProps {
  rentState: RentState;
  rentId: number;
}

const RentStateButtons = ({ rentState, rentId }: RentStateButtonsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const { data: rentLines } = useRentLines(rentId);

  const handleSuccessConfirm = async () => {
    toast.success(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        was succesfully confirmed.
      </span>
    );

    if (!rentLines) return;

    await updateStock(rentLines, "rentedQuantity");

    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorConfirm = () =>
    toast.warning(
      <span>
        Not enough stock available for rent
        <span className="font-semibold"> {rentId}. </span>
      </span>
    );

  const handleSuccessSent = () =>
    toast.success(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        was succesfully sent.
      </span>
    );

  const handleErrorSent = () =>
    toast.error(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        could not be sent.
      </span>
    );

  const handleSuccessReturn = async () => {
    toast.success(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        was succesfully returned.
      </span>
    );

    rentLines && (await updateStock(rentLines, "returnedQuantity"));
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorReturn = () =>
    toast.error(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        could not be returned.
      </span>
    );

  const handleSuccessCancel = async () => {
    toast.success(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        was succesfully cancelled.
      </span>
    );
    rentLines && (await updateStock(rentLines, "returnedQuantity"));
    await queryClient.refetchQueries({ queryKey: ["stocks"] });
  };

  const handleErrorCancel = () =>
    toast.error(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        could not be cancelled.
      </span>
    );

  const handleSuccessDelete = () => {
    toast.success(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        was succesfully deleted.
      </span>
    );
  };

  const handleErrorDelete = () => {
    toast.error(
      <span>
        Rent
        <span className="font-semibold"> {rentId} </span>
        could not be deleted.
      </span>
    );
  };

  const updateStock = async (
    rentLines: FetchRentLineResponse[],
    operation: keyof Pick<
      Stock,
      | "rentedQuantity"
      | "receivedQuantity"
      | "returnedQuantity"
      | "incomingQuantity"
    >
  ): Promise<void> => {
    const apiClient = new ApiClient<Stock>("stocks/update");

    for (const line of rentLines) {
      console.log(line.article.articleid);
      await apiClient.update(Number(line.article.articleid), {
        [operation]: line.quantity,
      });
    }
  };

  return (
    <div className="inline-flex flex-col gap-2 w-full md:w-1/4 lg:w-1/6">
      {rentState === RentState.NEW && (
        <StateChangeButton<FetchRentResponse>
          disabled={rentLines?.length === 0}
          endpoint="/rents/confirm"
          itemId={rentId}
          title="Set status to confirmed"
          buttonText="Confirm rent"
          queryKeys={[
            ["rents"],
            ["rent"],
            ["rents-new"],
            ["rent-order-lines"],
            ["rent-order-line"],
          ]}
          onSuccess={handleSuccessConfirm}
          onError={handleErrorConfirm}
        />
      )}

      {rentState === RentState.CONFIRMED && (
        <StateChangeButton<FetchRentResponse>
          endpoint="/rents/send"
          itemId={rentId}
          title="Set status to sent to customer"
          buttonText="Send to customer"
          queryKeys={[
            ["rents"],
            ["rent"],
            ["rent-order-lines"],
            ["rent-order-line"],
          ]}
          onSuccess={handleSuccessSent}
          onError={handleErrorSent}
        />
      )}

      {rentState === RentState.SENT && (
        <StateChangeButton<FetchRentResponse>
          endpoint="/rents/return"
          itemId={rentId}
          title="Set status to returned"
          buttonText="Return rent"
          queryKeys={[
            ["rents"],
            ["rent"],
            ["rent-order-lines"],
            ["rent-order-line"],
          ]}
          onSuccess={handleSuccessReturn}
          onError={handleErrorReturn}
        />
      )}

      {(rentState === RentState.NEW || rentState === RentState.CONFIRMED) && (
        <StateChangeButton<FetchRentResponse>
          variant="outline"
          endpoint="/rents/cancel"
          itemId={rentId}
          title="Set status to cancelled"
          buttonText="Cancel rent"
          queryKeys={[
            ["rents"],
            ["rent"],
            ["rent-order-lines"],
            ["rent-order-line"],
          ]}
          onSuccess={handleSuccessCancel}
          onError={handleErrorCancel}
        />
      )}

      {rentState === RentState.NEW && (
        <Button
          onClick={() => navigate(`/rents/update/${rentId}`)}
          title="Edit rent order"
          variant="outline"
        >
          <PenIcon /> Edit
        </Button>
      )}
      {(rentState === RentState.NEW ||
        rentState === RentState.RETURNED ||
        rentState === RentState.CANCELLED) && (
        <Button
          onClick={() => setDeleteOpen(true)}
          title="Delete rent order"
          variant="destructive"
        >
          <TrashIcon /> Delete
        </Button>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          queryKeys={[
            ["rent-lines"],
            ["rents"],
            ["applied-penalties"],
            ["rents-new"],
          ]}
          removeQueryKeys={[
            ["rent", `${rentId}`],
            ["rent-order-lines", `${rentId}`],
            ["rent-applied-penalties", `${rentId}`],
          ]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          endpoint={`/rents/delete/${rentId}`}
          redirectPath="/rents/all"
          onSuccess={handleSuccessDelete}
          onError={handleErrorDelete}
        />
      )}
    </div>
  );
};

export default RentStateButtons;
