import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import ApiClient from "@/services/api-client";
import SalesOrder from "@/entities/SalesOrder";
import { useCustomers } from "@/hooks/use-relations";
import DatePicker from "@/components/partials/DatePicker";
import LookUpButton from "@/components/partials/LookUpButton";
import LookUpCustomerDialog from "@/components/master-data/relations/LookUpCustomersDialog";
import useRelationStore from "@/stores/relation-store";
import useSalesOrders from "@/hooks/use-sales-orders";
import RedirectDialog from "@/components/partials/RedirectDialog";

const formSchema = z.object({
  customerId: z.number().min(1, "Customer ID cannot be empty"),
  date: z.date(),
  TotalAmount: z.number().default(0),
  TotalAmountWithVAT: z.number().default(0),
});

const defaultValues: z.infer<typeof formSchema> = {
  customerId: 0,
  date: new Date(),
  TotalAmount: 0,
  TotalAmountWithVAT: 0,
};

const SalesOrderForm = () => {
  const [isCustomerLookupOpen, setCustomerLookupOpen] = useState(false);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [salesOrderId, setSalesOrderId] = useState(id);
  const apiClient = new ApiClient<SalesOrder>("/sales-orders");
  const { customers } = useCustomers();
  const { data: salesOrders } = useSalesOrders();
  const { selectedRelation, setSelectedRelation, clearSelectedRelation } =
    useRelationStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedRelation();
    const value = Number(e.target.value);
    form.setValue("customerId", value);
    const customer = customers?.find((c) => c.relationid === value);
    if (customer) {
      setSelectedRelation(customer);
    }
  };

  useEffect(() => {
    const oldSelectedRelation = form.getValues("customerId");

    if (selectedRelation?.relationid) {
      if (oldSelectedRelation !== selectedRelation.relationid)
        form.setValue("customerId", selectedRelation.relationid);
    } else {
      form.setValue("customerId", 0);
    }
  }, [selectedRelation]);

  useEffect(() => {
    if (id && salesOrders) {
      const currentSalesOrder = salesOrders?.find(
        (s) => s.salesOrderId === Number(id)
      );
      if (currentSalesOrder) {
        form.reset({
          customerId: currentSalesOrder.customerId.relationid,
          date: new Date(currentSalesOrder.date),
        });
      }
      setIsUpdate(pathname.includes("update"));
    } else {
      form.reset(defaultValues);
    }
  }, [id, pathname, customers]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return apiClient.update(id, {
          ...values,
          customerId: { relationid: values.customerId },
        });
      }
      return apiClient.create({
        ...values,
        customerId: { relationid: values.customerId },
      });
    },
    onSuccess: async (salesOrder) => {
      !isUpdate && form.reset(defaultValues);
      setRedirectDialogOpen(true);
      salesOrder &&
        salesOrder.salesOrderId &&
        setSalesOrderId(salesOrder.salesOrderId.toString());
      await queryClient.refetchQueries({ queryKey: ["sales-orders"] });
      toast.success(
        isUpdate
          ? "Sales Order was successfully updated."
          : "Sales Order was successfully added."
      );
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Sales Order could not be updated."
          : "Sales Order could not be added."
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
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-black">Customer</FormLabel>
              <div className="flex gap-1 items-center">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter customer id"
                    value={field.value || ""}
                    onChange={handleCustomerChange}
                    className="w-full"
                  />
                </FormControl>
                <LookUpButton setOpen={setCustomerLookupOpen} />
                {isCustomerLookupOpen && (
                  <LookUpCustomerDialog
                    open={isCustomerLookupOpen}
                    setOpen={setCustomerLookupOpen}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Order Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={(selectedDate) => field.onChange(selectedDate)}
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
            setOpen={setRedirectDialogOpen}
            backPath={"/sales-orders/all"}
            viewPath={`/sales-orders/view/${salesOrderId}`}
            addPath={!isUpdate ? `/sales-orders/new` : ""}
            message={
              isUpdate
                ? "Sales order was successfully updated."
                : "Sales order was successfully created."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default SalesOrderForm;
