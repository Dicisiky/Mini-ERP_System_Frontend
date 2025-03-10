import DeleteDialog from "@/components/partials/DeleteDialog";
import { Button } from "@/components/ui/button";
import { RentState } from "@/entities/Rent";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface RentLineButtonsProps {
  rentState: RentState;
  rentLineId: number;
  rentId?: number;
}

const RentLineButtons = ({
  rentState,
  rentId,
  rentLineId,
}: RentLineButtonsProps) => {
  const navigate = useNavigate();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  return (
    <div className="inline-flex flex-col gap-2 w-full md:w-1/4 lg:w-1/6">
      {rentState === RentState.NEW && (
        <Button
          onClick={() =>
            rentId
              ? navigate(`/rents/${rentId}/rent-lines/update/${rentLineId}`)
              : navigate(`/rent-lines/update/${rentLineId}`)
          }
          title="Edit rent line"
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
          title="Delete rent line"
          variant="destructive"
        >
          <TrashIcon /> Delete
        </Button>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          queryKeys={[["rents"], ["applied-penalties"]]}
          removeQueryKeys={[
            ["rent-order-line", `${rentLineId}`],
            ["rent-applied-penalties", `${rentLineId}`],
          ]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          endpoint={`/rentlines/delete/${rentLineId}`}
          redirectPath={
            rentId ? `/rents/view/${rentId}` : `/rent-lines/view/${rentLineId}`
          }
          onSuccess={() =>
            toast.success(
              <span>
                Rent line <span className="font-semibold">{rentLineId} </span>
                from rent order <span className="font-semibold">{rentId} </span>
                was succesfully deleted.
              </span>
            )
          }
          onError={() =>
            toast.success(
              <span>
                Rent line <span className="font-semibold">{rentLineId} </span>
                from rent order <span className="font-semibold">{rentId} </span>
                could not be deleted.
              </span>
            )
          }
        />
      )}
    </div>
  );
};

export default RentLineButtons;
