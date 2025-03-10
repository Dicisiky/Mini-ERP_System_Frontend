import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import RedirectDialog from "@/components/partials/RedirectDialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Penalty, { penaltyTypeOptions, PenaltyTypes } from "@/entities/Penalty";
import usePenalties from "@/hooks/use-penalties";
import ApiClient from "@/services/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const formSchema = z.object({
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description cannot be empty"),
  penaltytype: z.nativeEnum(PenaltyTypes, {
    required_error: "Penalty type is required",
    invalid_type_error: "Penalty type must be one of the allowed values",
  }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price must be at least 0"),
});

const defaultValues: z.infer<typeof formSchema> = {
  description: "",
  penaltytype: PenaltyTypes.LP,
  price: 0,
};

const PenaltiesForm = () => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [penaltyId, setPenaltyId] = useState(id);
  const { data: penalties } = usePenalties();
  const apiClient = new ApiClient<Penalty>("/penalties");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (id && penalties) {
      const penalty = penalties.find((p) => p.penaltyid === Number(id));
      if (penalty) {
        form.reset(penalty);
      }
    } else {
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, penalties]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return apiClient.update(id, {
          penaltyid: Number(id),
          ...values,
        });
      }
      return apiClient.create(values);
    },
    onSuccess: async (penalty) => {
      setIsRedirectDialogOpen(true);
      toast.success(
        isUpdate ? (
          <span>
            Penalty{" "}
            <span className="font-semibold"> {penalty.description} </span> was
            successfully updated.
          </span>
        ) : (
          <span>
            Penalty{" "}
            <span className="font-semibold"> {penalty.description} </span> was
            successfully added
          </span>
        )
      );
      penalty.penaltyid && setPenaltyId(penalty.penaltyid.toString());
      await queryClient.refetchQueries({ queryKey: ["penalties"] });
      if (!isUpdate) {
        form.reset(defaultValues);
      }
    },
    onError: (error) => {
      toast.error(
        isUpdate ? (
          <span>Penalty could not be updated</span>
        ) : (
          <span>Penalty could not be added</span>
        )
      );
      console.error("Error during mutation:", error);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-6 mt-5 max-w-lg"
      >
        <FormDescription>
          {isUpdate ? "Update the existing Penalty" : "Add a new Penalty"}
        </FormDescription>

        <div className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="penaltytype"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Penalty Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select penalty type" />
                    </SelectTrigger>
                    <SelectContent>
                      {penaltyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter penalty price"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-black">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Penalty for late article return"
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full md:w-1/2">
          {isPending ? (
            <>
              <LoaderIcon className="animate-spin" />
              {isUpdate ? "Updating..." : "Submitting..."}
            </>
          ) : isUpdate ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>

        {isRedirectDialogOpen && (
          <RedirectDialog
            open={isRedirectDialogOpen}
            setOpen={setIsRedirectDialogOpen}
            addPath={isUpdate ? "" : "/penalties/new"}
            viewPath={`/penalties/update/${penaltyId}`}
            backPath="/penalties/all"
            message={
              isUpdate
                ? "Penalty was successfully updated!"
                : "Penalty was successfully added!"
            }
          />
        )}
      </form>
    </Form>
  );
};

export default PenaltiesForm;
