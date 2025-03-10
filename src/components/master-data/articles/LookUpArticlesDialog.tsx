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
import LookupArticleColumns from "./LookUpArticleColumns";
import { Navigate } from "react-router";
import Loading from "../../partials/Loading";
import useArticleStore from "@/stores/article-store";
import useArticles from "@/hooks/use-articles";
import Article from "@/entities/Article";
import useArticleCategoryFilter from "@/hooks/use-article-category-filter";

interface LookupArticleDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookupArticleDialog = ({ open, setOpen }: LookupArticleDialogProps) => {
  const { data: articles, error, isLoading } = useArticles();
  const { selectedArticle, setSelectedArticle } = useArticleStore();
  const categoriesEnum = useArticleCategoryFilter();

  const [originalArticle, setOriginalArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (open) {
      setOriginalArticle(selectedArticle);
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedArticle(originalArticle);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`top-[50%] max-w-6xl max-h-[80vh] md:max-h-[100vh] overflow-y-auto scrollbar-thin`}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">Articles</DialogTitle>
          <DialogDescription>Choose an article from the list</DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && articles && (
          <div className="overflow-x-auto px-2">
            <DataTable
              filterEnumColumns={categoriesEnum && ["categoryName"]}
              filterEnumPlaceholders={
                categoriesEnum && ["Filter by article category..."]
              }
              enums={categoriesEnum && categoriesEnum}
              filterTextColumns={["name"]}
              filterTextPlaceholders={["Search by article name"]}
              columns={LookupArticleColumns}
              data={articles}
              rowSelection={selectedArticle}
              setRowSelection={setSelectedArticle}
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

export default LookupArticleDialog;
