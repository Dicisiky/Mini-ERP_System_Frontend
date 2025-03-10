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
import VatRateType from "@/entities/VatRate";
import useVatRates from "@/hooks/use-vatrates";
import ApiClient from "@/services/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const formSchema = z.object({
  percent: z
    .number({
      invalid_type_error: "Percent must be a number",
    })
    .min(1, "Percent must be at least 1")
    .max(21, "Percent must not exceed 21"),
});

const defaultValues = {
  percent: 1,
};

const VatRateForm = () => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [vatId, setVatId] = useState(id);
  const { data: vatRates } = useVatRates();
  const apiClient = new ApiClient<VatRateType>("/vatrates");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (id && vatRates) {
      const vatRate = vatRates.find((v) => v.vatid === Number(id));
      if (vatRate) {
        form.reset({ percent: vatRate.percent });
      }
    } else {
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, vatRates]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return apiClient.update(id, {
          vatid: Number(id),
          percent: values.percent,
        });
      }
      return apiClient.create(values);
    },
    onSuccess: async (vatRate) => {
      setIsRedirectDialogOpen(true);
      toast.success(
        isUpdate ? (
          <span>
            Vat rate <span className="font-semibold"> {vatRate.percent} %</span>{" "}
            was successfully updated.
          </span>
        ) : (
          <span>
            Vat rate <span className="font-semibold"> {vatRate.percent} %</span>{" "}
            was successfully added
          </span>
        )
      );
      vatRate.vatid && setVatId(vatRate.vatid.toString());
      await queryClient.refetchQueries({ queryKey: ["vat-rates"] });
      await queryClient.refetchQueries({
        queryKey: ["articles"],
      });
      if (!isUpdate) {
        form.reset(defaultValues);
      }
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "VAT Rate could not be updated."
          : "VAT Rate could not be added."
      );
      console.error("Error during mutation:", error);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-8 mt-5 md:max-w-48"
      >
        <FormDescription>
          {isUpdate ? "Update the existing VAT Rate" : "Add a new VAT Rate"}
        </FormDescription>

        <FormField
          control={form.control}
          name="percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Percent</FormLabel>

              <FormControl>
                <Input
                  type="text"
                  placeholder="Type new VAT rate"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
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
            addPath={isUpdate ? "" : "/vat-rates/new"}
            viewPath={`/vat-rates/update/${vatId}`}
            backPath="/vat-rates/all"
            message={
              isUpdate
                ? "VAT rate was successfully updated!"
                : "VAT rate was successfully added!"
            }
          />
        )}
      </form>
    </Form>
  );
};

export default VatRateForm;
