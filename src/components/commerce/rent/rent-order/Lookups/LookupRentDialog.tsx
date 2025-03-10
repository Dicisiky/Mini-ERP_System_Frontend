import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { FetchRentResponse } from "@/entities/Rent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import useRentStore from "@/stores/rent-store";
import LookupRentColumns from "./LookupRentColumns";
import { Button } from "@/components/ui/button";
import useValidRents from "@/hooks/use-valid-rents";

interface LookupRentDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupRentDialog = ({ open, setOpen }: LookupRentDialogProps) => {
  const { data: rents, error, isLoading } = useValidRents();
  const { selectedRent, setSelectedRent } = useRentStore();

  const [originalRent, setOriginalRent] = useState<FetchRentResponse | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setOriginalRent(selectedRent);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedRent(originalRent);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`${
          rents && rents.length > 1
            ? "top-[40%]"
            : rents && rents.length > 4
            ? "top-[50%]"
            : "top-[30%]"
        } max-w-7xl max-h-[80vh] md:max-h-max overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">Rents</DialogTitle>
          <DialogDescription>
            Choose a rent order from the list
          </DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && rents && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["customerName"]}
              filterTextPlaceholders={["Search by customer name"]}
              columns={LookupRentColumns}
              data={rents}
              rowSelection={selectedRent}
              setRowSelection={setSelectedRent}
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

export default LookupRentDialog;
