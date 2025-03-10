import DataTable from "@/components/partials/DataTable/DataTable";
import Loading from "@/components/partials/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Penalty from "@/entities/Penalty";
import usePenalties from "@/hooks/use-penalties";
import usePenaltyStore from "@/stores/penalty-store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Navigate } from "react-router";
import LookupPenaltyColumns from "./LookupPenaltyColumn";

interface LookupPenaltyDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupPenaltyDialog = ({ open, setOpen }: LookupPenaltyDialogProps) => {
  const { data: penalties, error, isLoading } = usePenalties();
  const { selectedPenalty, setSelectedPenalty } = usePenaltyStore();

  const [originalPenalty, setOriginalPenalty] = useState<Penalty | null>(null);

  useEffect(() => {
    if (open) {
      setOriginalPenalty(selectedPenalty);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedPenalty(originalPenalty);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`top-[50%] max-w-7xl max-h-[80vh] md:max-h-max overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">Penalties</DialogTitle>
          <DialogDescription>Choose a penalty from the list</DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && penalties && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["customerName"]}
              filterTextPlaceholders={["Search by customer name"]}
              columns={LookupPenaltyColumns}
              data={penalties}
              rowSelection={selectedPenalty}
              setRowSelection={setSelectedPenalty}
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

export default LookupPenaltyDialog;
