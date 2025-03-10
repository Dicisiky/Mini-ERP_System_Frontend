import DataTable from "../../partials/DataTable/DataTable";
import RelationsColumns from "./RelationsColumns";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../partials/Loading";
import useRelations from "@/hooks/use-relations";
import { relationTypeDescription } from "@/entities/Relation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const RelationsDataTable = () => {
  const { data, isLoading, error } = useRelations();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-10">
      <Button
        variant="default"
        title="Add a new relation"
        onClick={() => navigate(`/relations/new`)}
      >
        <PlusIcon />
        New relation
      </Button>
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterEnumPlaceholders={["Filter by relation type..."]}
          filterEnumColumns={["relationTypeDescription"]}
          enums={relationTypeDescription}
          columns={RelationsColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default RelationsDataTable;
