import useVatRates from "@/hooks/use-vatrates";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "../../partials/Loading";
import { Navigate } from "react-router";
import DataTable from "../../partials/DataTable/DataTable";
import LookupVatRatesColumns from "./LookUpVatRatesColumns";
import useVatRateStore from "@/stores/vat-rate-store";
import VatRateType from "@/entities/VatRate";

interface LookUpArticleDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookUpVatRateDialog = ({ open, setOpen }: LookUpArticleDialogProps) => {
  const { data, error, isLoading } = useVatRates();
  const { selectedVatRate, setSelectedVatRate } = useVatRateStore();

  const [originalVatRate, setOriginalVatRate] = useState<VatRateType | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setOriginalVatRate(selectedVatRate);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedVatRate(originalVatRate);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[50%] md:top-[40%] !max-w-xl max-h-[80vh] md:max-h-max overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">VAT Rates</DialogTitle>
          <DialogDescription>Choose a VAT rate from the list</DialogDescription>
        </DialogHeader>

        {isLoading && <Loading />}
        {error && <Navigate to="/error" />}
        {!isLoading && !error && data && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["percent"]}
              filterTextPlaceholders={["Search by VAT percent..."]}
              columns={LookupVatRatesColumns}
              data={data}
              rowSelection={selectedVatRate}
              setRowSelection={setSelectedVatRate}
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

export default LookUpVatRateDialog;
