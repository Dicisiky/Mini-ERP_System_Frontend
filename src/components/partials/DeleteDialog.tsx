import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "react-toastify";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import ApiClient from "@/services/api-client";
import { useNavigate } from "react-router";

interface DeleteDialogProps {
  endpoint: string;
  queryKeys?: QueryKey[];
  queryKey?: QueryKey;
  removeQueryKeys?: QueryKey[];
  removeQueryKey?: QueryKey;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  redirectPath?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

const DeleteDialog = ({
  endpoint,
  removeQueryKeys,
  removeQueryKey,
  queryKeys,
  queryKey,
  open,
  setOpen,
  redirectPath,
  onSuccess,
  onError,
}: DeleteDialogProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const apiClient = new ApiClient(endpoint);

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await apiClient.delete();
    },
    onSuccess: async () => {
      if (redirectPath) {
        navigate(redirectPath);
      }
      !onSuccess
        ? toast.success("Item was successfully deleted.")
        : onSuccess();
    },
    onError: (error) => {
      console.log(error);
      !onError ? toast.error("Item could not be deleted.") : onError();
    },

    onSettled: async () => {
      queryKeys &&
        (await Promise.all(
          queryKeys.map((key) => queryClient.refetchQueries({ queryKey: key }))
        ));
      queryKey && (await queryClient.refetchQueries({ queryKey }));

      removeQueryKeys &&
        (await Promise.all(
          removeQueryKeys.map(async (key) =>
            queryClient.removeQueries({ queryKey: key })
          )
        ));
      removeQueryKey && queryClient.removeQueries({ queryKey });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[40%] md:top-[30%] xl:top-[20%] py-10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">
            Are you absolutely sure you want to delete this item?
          </DialogTitle>
          <DialogDescription className="text-sm text-destructive">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            className="inline-flex gap-2 items-center"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircleIcon className="animate-spin" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
