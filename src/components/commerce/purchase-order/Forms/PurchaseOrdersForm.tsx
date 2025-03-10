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
import PurchaseOrder from "@/entities/PurchaseOrder";
import { useSuppliers } from "@/hooks/use-relations";
import DatePicker from "@/components/partials/DatePicker";
import LookUpButton from "@/components/partials/LookUpButton";
import useRelationStore from "@/stores/relation-store";
import usePurchaseOrders from "@/hooks/use-purchase-orders";
import RedirectDialog from "@/components/partials/RedirectDialog";
import LookUpSupplierDialog from "@/components/master-data/relations/LookUpSupplierDialog";

const formSchema = z.object({
  supplierId: z.number().min(1, "Supplier ID cannot be empty"),
  date: z.date(),
  TotalAmount: z.number().default(0),
  TotalAmountWithVAT: z.number().default(0),
});

const defaultValues: z.infer<typeof formSchema> = {
  supplierId: 0,
  date: new Date(),
  TotalAmount: 0,
  TotalAmountWithVAT: 0,
};

const PurchaseOrderForm = () => {
  const [isSupplierLookupOpen, setSupplierLookupOpen] = useState(false);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [purchaseOrderId, setPurchaseOrderId] = useState(id);
  const apiClient = new ApiClient<PurchaseOrder>("/purchase-orders");
  const { suppliers } = useSuppliers();
  const { data: purchaseOrders } = usePurchaseOrders();
  const { selectedRelation, setSelectedRelation, clearSelectedRelation } =
    useRelationStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSupplierChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedRelation();
    const value = Number(e.target.value);
    form.setValue("supplierId", value);
    const supplier = suppliers?.find((s) => s.relationid === value);
    if (supplier) {
      setSelectedRelation(supplier);
    }
  };

  useEffect(() => {
    const oldSelectedRelation = form.getValues("supplierId");

    if (selectedRelation?.relationid) {
      if (oldSelectedRelation !== selectedRelation.relationid)
        form.setValue("supplierId", selectedRelation.relationid);
    } else {
      form.setValue("supplierId", 0);
    }
  }, [selectedRelation]);

  useEffect(() => {
    if (id && purchaseOrders) {
      const currentPurchaseOrder = purchaseOrders?.find(
        (p) => p.purchaseOrderId === Number(id)
      );
      if (currentPurchaseOrder) {
        form.reset({
          supplierId: currentPurchaseOrder.supplierId.relationid,
          date: new Date(currentPurchaseOrder.date),
        });
      }
      setIsUpdate(pathname.includes("update"));
    } else {
      form.reset(defaultValues);
    }
  }, [id, pathname, suppliers]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return apiClient.update(id, {
          ...values,
          supplierId: { relationid: values.supplierId },
        });
      }
      return apiClient.create({
        ...values,
        supplierId: { relationid: values.supplierId },
      });
    },
    onSuccess: async (purchaseOrder) => {
      !isUpdate && form.reset(defaultValues);
      setRedirectDialogOpen(true);
      purchaseOrder &&
        purchaseOrder.purchaseOrderId &&
        setPurchaseOrderId(purchaseOrder.purchaseOrderId.toString());
      await queryClient.refetchQueries({ queryKey: ["purchase-orders"] });
      toast.success(
        isUpdate
          ? "Purchase order was successfully updated."
          : "Purchase order was successfully added."
      );
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Purchase order could not be updated."
          : "Purchase order could not be added."
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
          name="supplierId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-black">Supplier</FormLabel>
              <div className="flex gap-1 items-center">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter supplier id"
                    value={field.value || ""}
                    onChange={handleSupplierChange}
                    className="w-full"
                  />
                </FormControl>
                <LookUpButton setOpen={setSupplierLookupOpen} />
                {isSupplierLookupOpen && (
                  <LookUpSupplierDialog
                    open={isSupplierLookupOpen}
                    setOpen={setSupplierLookupOpen}
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
            backPath={"/purchase-orders/all"}
            viewPath={`/purchase-orders/view/${purchaseOrderId}`}
            addPath={!isUpdate ? `/purchase-orders/new` : ""}
            message={
              isUpdate
                ? "Purchase order was successfully updated."
                : "Purchase order was successfully created."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default PurchaseOrderForm;
