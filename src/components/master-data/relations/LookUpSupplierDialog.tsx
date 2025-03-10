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
import LookupSupplierColumns from "./LookUpSupplierColumns";
import { useSuppliers } from "@/hooks/use-relations";
import { Navigate } from "react-router";
import Loading from "../../partials/Loading";
import useRelationStore from "@/stores/relation-store";
import RelationType from "@/entities/Relation";

interface LookUpSupplierDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookUpSupplierDialog = ({ open, setOpen }: LookUpSupplierDialogProps) => {
  const { suppliers, error, isLoading } = useSuppliers();
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
          <DialogTitle className="font-normal">Suppliers</DialogTitle>
          <DialogDescription>Choose a supplier from the list</DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && suppliers && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["name"]}
              filterTextPlaceholders={["Search by supplier name"]}
              columns={LookupSupplierColumns}
              data={suppliers}
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

export default LookUpSupplierDialog;
