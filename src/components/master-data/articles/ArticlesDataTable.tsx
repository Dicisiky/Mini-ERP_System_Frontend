import DataTable from "../../partials/DataTable/DataTable";
import ArticleColumns from "./ArticlesColumns";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../partials/Loading";
import useArticles from "@/hooks/use-articles";
import useArticleCategoryFilter from "@/hooks/use-article-category-filter";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ArticlesDataTable = () => {
  const { data, isLoading, error } = useArticles();
  const navigate = useNavigate();
  const categoriesEnum = useArticleCategoryFilter();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new article"
        onClick={() => navigate(`/articles/new`)}
      >
        <PlusIcon />
        New article
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterTextColumns={["name"]}
          filterEnumColumns={categoriesEnum && ["categoryName"]}
          filterEnumPlaceholders={
            categoriesEnum && ["Filter by article category..."]
          }
          enums={categoriesEnum && categoriesEnum}
          filterTextPlaceholders={["Search by article name..."]}
          columns={ArticleColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default ArticlesDataTable;
