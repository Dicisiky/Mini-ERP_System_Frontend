import { Button } from "@/components/ui/button";
import ApiClient from "@/services/api-client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

interface StateChangeButtonProps {
  variant?:
    | "default"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
    | "outline";
  endpoint: string;
  itemId: number;
  buttonText: string;
  queryKey?: QueryKey;
  queryKeys?: QueryKey[];
  onSuccess?: () => void;
  onError?: () => void;
  title?: string;
  disabled?: boolean;
}

const StateChangeButton = <T,>({
  endpoint,
  disabled,
  variant,
  itemId,
  buttonText,
  queryKey,
  queryKeys,
  onSuccess,
  onError,
  title,
}: StateChangeButtonProps) => {
  const apiClient = new ApiClient<T>(endpoint);
  const queryClient = useQueryClient();

  // Define the mutation
  const { isPending, mutate } = useMutation({
    mutationFn: async () => await apiClient.update(itemId),
    onSuccess: async () => {
      queryKey && (await queryClient.refetchQueries({ queryKey }));
      queryKeys &&
        (await Promise.all(
          queryKeys.map(
            async (queryKey) => await queryClient.refetchQueries({ queryKey })
          )
        ));
      !onSuccess
        ? toast.success(`State updated for item with id ${itemId}.`)
        : onSuccess();
    },

    onError: (error: any) => {
      if (error.response) {
        const { data } = error.response;
        console.log(data);
      }
      onError && onError();
    },
  });

  return (
    <Button
      title={title}
      variant={variant}
      onClick={() => mutate()}
      disabled={isPending || disabled}
      className="flex items-center gap-2"
    >
      {isPending ? (
        <>
          <LoaderCircle className="text-primary-foreground animate-spin duration-300" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};

export default StateChangeButton;
