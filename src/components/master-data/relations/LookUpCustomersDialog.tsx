import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DataTable from "../../partials/DataTable/DataTable";
import LookupCustomerColumns from "./LookUpCustomerColumns";
import { useCustomers } from "@/hooks/use-relations";
import { Navigate } from "react-router";
import Loading from "../../partials/Loading";
import useRelationStore from "@/stores/relation-store";
import RelationType from "@/entities/Relation";

interface LookUpCustomerDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookUpCustomerDialog = ({ open, setOpen }: LookUpCustomerDialogProps) => {
  const { customers, error, isLoading } = useCustomers();
  const { selectedRelation, setSelectedRelation } = useRelationStore();

  const [originalRelation, setOriginalRelation] = useState<RelationType | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setOriginalRelation(selectedRelation);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedRelation(originalRelation);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[50%] max-w-6xl max-h-[80vh] md:max-h-max overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">Customers</DialogTitle>
          <DialogDescription>Choose a customer from the list</DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && customers && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["name"]}
              filterTextPlaceholders={["Search by customer name"]}
              columns={LookupCustomerColumns}
              data={customers}
              rowSelection={selectedRelation}
              setRowSelection={setSelectedRelation}
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

export default LookUpCustomerDialog;
