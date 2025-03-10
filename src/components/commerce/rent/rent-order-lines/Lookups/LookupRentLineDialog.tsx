import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import { Button } from "@/components/ui/button";
import useRentLines from "@/hooks/use-rent-lines";
import useRentLineStore from "@/stores/rent-line-store";
import { FetchRentLineResponse } from "@/entities/RentLine";
import LookupRentLineColumns from "./LookupRentLineColumns";

interface LookupRentLineDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupRentLineDialog = ({ open, setOpen }: LookupRentLineDialogProps) => {
  const { rentId } = useParams();
  const { data: rentLines, error, isLoading } = useRentLines();
  const [filteredRentLines, setFilteredRentLines] = useState<
    FetchRentLineResponse[]
  >([]);
  const { selectedRentLine, setSelectedRentLine } = useRentLineStore();
  const [originalRentLine, setOriginalRentLine] =
    useState<FetchRentLineResponse | null>(null);

  useEffect(() => {
    const filteredRentLines = rentLines?.filter(
      (rl) => rl.rent.rentId === Number(rentId)
    );
    if (rentId && filteredRentLines) {
      setFilteredRentLines(filteredRentLines);
    }
  }, [rentId, rentLines]);
  useEffect(() => {
    if (open) {
      setOriginalRentLine(selectedRentLine);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedRentLine(originalRentLine);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`top-[50%] max-w-screen-2xl max-h-[80vh] md:max-h-[100vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">Rent lines</DialogTitle>
          <DialogDescription>
            Choose a rent line from the list
          </DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && rentLines && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["customerName"]}
              filterTextPlaceholders={["Search by customer name"]}
              columns={LookupRentLineColumns}
              data={rentId ? filteredRentLines : rentLines}
              rowSelection={selectedRentLine}
              setRowSelection={setSelectedRentLine}
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

export default LookupRentLineDialog;
