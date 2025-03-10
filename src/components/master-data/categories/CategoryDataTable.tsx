import Loading from "../../partials/Loading";
import { Navigate, useNavigate } from "react-router";
import DataTable from "../../partials/DataTable/DataTable";
import CategoryColumns from "./CategoryColumns";
import useCategories from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const CategoryDataTable = () => {
  const { data, error, isLoading } = useCategories();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        className="mb-4"
        variant="default"
        title="Add a new category"
        onClick={() => navigate(`/categories/new`)}
      >
        <PlusIcon />
        New category
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <div className="w-full overflow-x-auto">
          <DataTable columns={CategoryColumns} data={data} />
        </div>
      )}
    </div>
  );
};

export default CategoryDataTable;
