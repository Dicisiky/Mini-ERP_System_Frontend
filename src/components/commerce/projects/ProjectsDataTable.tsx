import DataTable from "../../partials/DataTable/DataTable";
import { Navigate } from "react-router-dom";
import Loading from "../../partials/Loading";
import ProjectColumns from "./ProjectsColumns";
import useProjects from "@/hooks/use-projects";
import { FetchProjectResponse, projectTypeOptions } from "@/entities/Project";
import { useEffect, useState } from "react";

const ProjectsDataTable = () => {
  const { data, error, isLoading } = useProjects();

  const [normalizedData, setNormalizedData] =
    useState<FetchProjectResponse[]>();

  useEffect(() => {
    if (data) {
      const normalizedData = data.map((project) => ({
        ...project,
        customerName: project.customerId.name,
      }));
      setNormalizedData(normalizedData);
    }
  }, [data]);

  return (
    <div className="container mx-auto py-10">
      {isLoading && <Loading />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && normalizedData && (
        <div className="w-full overflow-x-auto">
          <DataTable
            filterEnumColumns={["projectTypeDescription"]}
            filterEnumPlaceholders={["Filter by project type"]}
            enums={projectTypeOptions}
            filterTextColumns={["customerName"]}
            filterTextPlaceholders={["Search by customer name"]}
            columns={ProjectColumns}
            data={normalizedData}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectsDataTable;
