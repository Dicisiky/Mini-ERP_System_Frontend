import useCategories from "@/hooks/use-categories";
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
import LookupCategoryColumns from "./LookUpCategoryColumns";
import useCategoryStore from "@/stores/category-store";
import Category from "@/entities/Category";

interface LookUpCategoryDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookUpCategoryDialog = ({ open, setOpen }: LookUpCategoryDialogProps) => {
  const { data, error, isLoading } = useCategories();
  const { setSelectedCategory, selectedCategory } = useCategoryStore();

  const [originalCategory, setOriginalCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setOriginalCategory(selectedCategory);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedCategory(originalCategory);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[50%] md:top-[40%] max-w-3xl max-h-[80vh] md:max-h-max overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">Categories</DialogTitle>
          <DialogDescription>Choose a category from the list</DialogDescription>
        </DialogHeader>

        {isLoading && <Loading />}
        {error && <Navigate to="/error" />}
        {!isLoading && !error && data && (
          <div className="w-full overflow-x-auto px-2">
            <DataTable
              filterTextColumns={["name"]}
              filterTextPlaceholders={["Search by category name..."]}
              columns={LookupCategoryColumns}
              data={data}
              setRowSelection={setSelectedCategory}
              rowSelection={selectedCategory}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
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

export default LookUpCategoryDialog;
