import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import useRents from "@/hooks/use-rents";
import ApiClient from "@/services/api-client";
import Rent from "@/entities/Rent";
import DatePicker from "@/components/partials/DatePicker";
import LookUpButton from "@/components/partials/LookUpButton";
import LookUpCustomerDialog from "@/components/master-data/relations/LookUpCustomersDialog";
import useRelationStore from "@/stores/relation-store";
import { useCustomers } from "@/hooks/use-relations";
import RedirectDialog from "@/components/partials/RedirectDialog";

const formSchema = z
  .object({
    customer: z
      .number({
        invalid_type_error: "Customer id must be a number",
      })
      .min(1, "Customer id is required"),

    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    endDate: z.date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    }),
  })
  .refine((values) => values.endDate > values.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"],
  });

const defaultValues: z.infer<typeof formSchema> = {
  customer: 0,
  startDate: new Date(),
  endDate: new Date(),
};

const RentForm = () => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isCustomerLookupOpen, setCustomerLookupOpen] = useState(false);
  const { id } = useParams();
  const [rentId, setRentId] = useState(id);
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const { data: rents } = useRents();
  const { selectedRelation, setSelectedRelation, clearSelectedRelation } =
    useRelationStore();
  const { customers } = useCustomers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (id && rents) {
      const rent = rents.find((r) => r.rentId === Number(id));
      if (rent) {
        form.reset({
          customer: rent.customer.relationid,
          startDate: new Date(rent.startDate),
          endDate: new Date(rent.endDate),
        });

        const rentCustomer = customers?.find(
          (r) => r.relationid === rent.customer.relationid
        );

        if (rentCustomer) setSelectedRelation(rentCustomer);
      }
    } else {
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, rents, customers]);

  // sync rent form with Relation store when customer value is changed manually
  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedRelation();
    const value = Number(e.target.value);
    form.setValue("customer", value);
    const customer = customers?.find((c) => c.relationid === value);
    if (customer) {
      setSelectedRelation(customer);
    }
  };

  // sync rent form with relation store when customer is changed from pick-up
  useEffect(() => {
    const oldSelectedCustomer = form.getValues("customer");
    if (selectedRelation?.relationid) {
      if (oldSelectedCustomer !== selectedRelation.relationid)
        form.setValue("customer", selectedRelation.relationid);
    } else {
      form.setValue("customer", 0);
    }
  }, [selectedRelation]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        const apiClient = new ApiClient<Rent>("/rents/update");

        return apiClient.update(id, {
          ...values,
          customer: { relationid: values.customer },
        });
      }

      const apiClient = new ApiClient<Rent>("/rents/create");

      return apiClient.create({
        ...values,
        customer: { relationid: values.customer },
      });
    },
    onSuccess: async (rent) => {
      setRedirectDialogOpen(true);
      if (isUpdate) {
        toast.success("Rent was successfully updated!");
      } else {
        toast.success("Rent was successfully created!");
        form.reset(defaultValues);
        rent.rentId && setRentId(rent.rentId.toString());
      }

      await queryClient.refetchQueries({ queryKey: ["rents"] });
      clearSelectedRelation();
    },
    onError: (error) => {
      toast.error(
        isUpdate ? "Rent could not be updated." : "Rent could not be added."
      );
      console.error("Error during mutation:", error);
    },
  });

  useEffect(() => {
    // Cleanup: Clear the store when the component unmounts
    return () => {
      clearSelectedRelation();
    };
  }, [pathname]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-8 mt-5 md:max-w-96"
      >
        <FormDescription>
          {isUpdate ? "Update the existing rent order" : "Add a new rent order"}
        </FormDescription>

        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
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

        <div className="flex flex-col md:flex-row gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Start date</FormLabel>
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

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">End date</FormLabel>
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
        </div>

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
            setOpen={setRedirectDialogOpen}
            backPath={`/rents/all`}
            viewPath={`/rents/view/${rentId}`}
            addPath={!isUpdate ? `/rents/new` : ""}
            message={
              isUpdate
                ? "Rent was successfully updated."
                : "Rent was successfully created."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default RentForm;
