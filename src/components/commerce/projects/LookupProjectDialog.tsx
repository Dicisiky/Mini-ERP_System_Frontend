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
import { Navigate } from "react-router";
import Loading from "../../partials/Loading";
import { FetchProjectResponse } from "@/entities/Project";
import useProjectStore from "@/stores/project-store";
import useProjects from "@/hooks/use-projects";
import LookupProjectDialogColumns from "./LookupProjectDialogColumns";

interface LookUpProjectDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LookUpProjectDialog = ({ open, setOpen }: LookUpProjectDialogProps) => {
    const {
        data:projects,
        error,
        isLoading
    } = useProjects()

    const [normalizedData, setNormalizedData] = useState <FetchProjectResponse[] | undefined>([]);
    
  const { selectedProject, setSelectedProject } = useProjectStore();

  const [originalProject, setOriginalProject] = useState<FetchProjectResponse | null>(
    null
  );

//   useEffect(() => {
//     if (open){
//         setOriginalProject(selectedProject)
//     }
//   }, [open]);
  
    useEffect(() => {
    if (projects){
        setNormalizedData(projects.map(p=> ({...p,customerName:p.customerId.name})))
    }
  }, [projects]);

  const handleCancel = () => {
    setSelectedProject(originalProject);
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[50%] max-w-6xl max-h-[80vh] md:max-h-max overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">Projects</DialogTitle>
          <DialogDescription>Choose a project from the list</DialogDescription>
        </DialogHeader>

        {error && <Navigate to="/error" />}
        {isLoading && <Loading />}
        {!isLoading && !error && normalizedData && (
          <div className="overflow-x-auto">
            <DataTable
              filterTextColumns={["customerName"]}
              filterTextPlaceholders={["Search by customer name"]}
              columns={LookupProjectDialogColumns}
              data={normalizedData}
              rowSelection={selectedProject}
              setRowSelection={setSelectedProject}
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

export default LookUpProjectDialog;
