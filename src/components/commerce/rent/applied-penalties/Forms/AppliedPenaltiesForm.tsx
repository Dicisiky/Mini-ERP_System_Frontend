import LookUpButton from "@/components/partials/LookUpButton";
import { Button } from "@/components/ui/button";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AppliedPenalty from "@/entities/AppliedPenalty";
import useAppliedPenalties from "@/hooks/use-applied-penalties";
import usePenalties from "@/hooks/use-penalties";
import useRentLines from "@/hooks/use-rent-lines";
import ApiClient from "@/services/api-client";
import usePenaltyStore from "@/stores/penalty-store";
import useRentLineStore from "@/stores/rent-line-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";
import LookupPenaltyDialog from "@/components/master-data/penalties/LookupPenaltydialog";
import LookupRentLineDialog from "../../rent-order-lines/Lookups/LookupRentLineDialog";
import RedirectDialog from "@/components/partials/RedirectDialog";

// ############## define form schema ##############
const formSchema = z.object({
  rentLineId: z
    .number({
      invalid_type_error: "Rent line id must be a number",
    })
    .min(1, "Rent line id is required"),

  penaltyId: z
    .number({
      invalid_type_error: "Penalty must be a valid number",
    })
    .min(1, "Penalty is required"),
});

// ############## define default form values ###################
const defaultValues: z.infer<typeof formSchema> = {
  rentLineId: 0,
  penaltyId: 0,
};

const AppliedPenaltiesForm = () => {
  // ############## hooks declarations ################
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isPenaltyLookupOpen, setPenaltyLookupOpen] = useState(false);
  const [isRentLineLookupOpen, setRentLineLookupOpen] = useState(false);
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const { id, rentId, rentLineId } = useParams();
  const { data: penalties } = usePenalties();
  const { data: rentLines } = useRentLines();
  const { data: appliedPenalties } = useAppliedPenalties();
  const { selectedRentLine, setSelectedRentLine, clearSelectedRentLine } =
    useRentLineStore();
  const { selectedPenalty, setSelectedPenalty, clearSelectedPenalty } =
    usePenaltyStore();

  // ############## declare form instance ##############
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // ########### Form handling logic, including pick-ups ################
  // ############## sync applied penalty form with rent line store when rent line value is changed manually ##############
  const handleRentLineChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedRentLine();
    const value = Number(e.target.value);
    form.setValue("rentLineId", value);
    const rentLine = rentLines?.find((r) => r.rentLineId === value);
    if (rentLine) {
      setSelectedRentLine(rentLine);
    }
  };

  // ############## sync applied penalty form with penalty store when penalty is changed manually ##############
  const handlePenaltyChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedPenalty();
    const value = Number(e.target.value);
    form.setValue("penaltyId", value);
    const penalty = penalties?.find((p) => p.penaltyid === value);
    if (penalty) {
      setSelectedPenalty(penalty);
    }
  };

  // ############## sync applied penalty form with rent and article stores when values are changed from pick-up ##############
  useEffect(() => {
    const oldSelectedRentLine = form.getValues("rentLineId");
    const oldSelectedPenalty = form.getValues("penaltyId");

    if (selectedRentLine?.rentLineId) {
      if (oldSelectedRentLine !== selectedRentLine.rentLineId)
        form.setValue("rentLineId", selectedRentLine.rentLineId);
    } else {
      form.setValue("rentLineId", 0);
    }

    if (selectedPenalty?.penaltyid) {
      if (oldSelectedPenalty !== selectedPenalty.penaltyid)
        form.setValue("penaltyId", selectedPenalty.penaltyid);
    } else {
      form.setValue("penaltyId", 0);
    }
  }, [selectedRentLine, selectedPenalty]);

  useEffect(
    () => {
      if (id && appliedPenalties) {
        // ############## load the form data and sync with penalty and rent line stores in edit mode ##############
        // ############## from the fetched data, search for the applied penalty that will be updated ##############
        const appliedPenalty = appliedPenalties.find(
          (ap) => ap.id === Number(id)
        );

        // ############## if the applied penalty was found, set the form fields values ##############
        if (appliedPenalty) {
          form.reset({
            ...appliedPenalty,
            // ############## rentLineId in the form is just a number (appliedPenalty.rentLine.rentLineId), ##############
            // ############## not an object (appliedPenalty.rentLine) ##############
            rentLineId: appliedPenalty.rentLine.rentLineId,
            // ############## penaltyId in the form is just a number (appliedPenalty.penalty.penaltyid), ##############
            // ############## not an object (appliedPenalty.penalty) ##############
            penaltyId: appliedPenalty.penalty.penaltyid,
          });

          // ############## prepare the pick-ups selected values ##############
          // ############## the values from the Applied Penalty will be set in the corresponding store (RentLineStore or PenaltyStore)

          const rentLine = rentLines?.find(
            (r) => r.rentLineId === appliedPenalty.rentLine.rentLineId
          );

          if (rentLine) setSelectedRentLine(rentLine);

          const penalty = penalties?.find(
            (p) => p.penaltyid === appliedPenalty.penalty.penaltyid
          );

          if (penalty) setSelectedPenalty(penalty);
        }
      } else {
        // ############## reset form fields in create mode ##############
        const currentRentLine = rentLines?.find(
          (rl) => rl.rentLineId === Number(rentLineId)
        );
        form.reset({
          ...defaultValues,
          ...(currentRentLine ? { rentLineId: currentRentLine.rentId } : null),
        });

        // ############## if the rentId is present in the pathname parameters, then set the selected rent in the store ##############
        if (currentRentLine) setSelectedRentLine(currentRentLine);
      }
      // ######### if the pathname includes 'update' string, then the update mode is active #########
      // ######### isUpdate is a state variable to dynamically handle the logic #########
      setIsUpdate(pathname.includes("update"));
    },
    // ######### [id, rentLines, appliedPenalties] = execute this entire useEffect every time a variable from the array gets changed
    [id, rentLines, appliedPenalties, rentId, rentLineId]
  );

  // ############## declare mutation function (POST/PUT Request) ##############
  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        const apiClient = new ApiClient<AppliedPenalty>(
          "/applied-penalties/update"
        );

        return apiClient.update(id, {
          ...values,
          rentLine: { rentLineId: values.rentLineId },
          penalty: { penaltyid: values.penaltyId },
        });
      }

      const apiClient = new ApiClient<AppliedPenalty>(
        "/applied-penalties/create"
      );

      return apiClient.create({
        ...values,
        rentLine: { rentLineId: values.rentLineId },
        penalty: { penaltyid: values.penaltyId },
      });
    },
    // ############## on success, clear stored values and show notification ##############
    onSuccess: async (appliedPenalty) => {
      setRedirectDialogOpen(true);
      clearSelectedRentLine();
      clearSelectedPenalty();
      if (isUpdate) {
        toast.success(
          <span>
            Applied penalty{" "}
            <span className="font-semibold"> {appliedPenalty.id} </span> was
            successfully updated within rent line{" "}
            <span className="font-semibold">
              {" "}
              {appliedPenalty.rentLine.rentLineId}{" "}
            </span>
            !
          </span>
        );
      } else {
        toast.success(
          <span>
            Penalty <span className="font-semibold"> {appliedPenalty.id} </span>{" "}
            was successfully applied to rent line{" "}
            <span className="font-semibold">
              {" "}
              {appliedPenalty.rentLine.rentLineId}{" "}
            </span>
            !
          </span>
        );
        form.reset(defaultValues);
      }

      //############## refetch affected queries, Promise.all is not mandatory when only one query is affected ##############
      await Promise.all(
        [
          ["applied-penalties"],
          ["rents"],
          ["rent"],
          ["rent-lines"],
          ["rent-applied-penalties"],
          ["rent-order-lines"],
          ["rent-order-line"],
        ].map((queryKey) => queryClient.refetchQueries({ queryKey }))
      );
    },
    // ############## on error, show notification and log error ##############
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Applied penalty could not be updated."
          : "Penalty could not be applied."
      );
      console.error("Error during mutation:", error);
    },
  });

  // ############## clean-up stored values when component unmounts (navigate away) ##############
  useEffect(() => {
    return () => {
      clearSelectedRentLine();
      clearSelectedPenalty();
    };
  }, [pathname]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-8 mt-5 md:max-w-96"
      >
        <FormDescription>
          {isUpdate ? "Update the applied penalty" : "Apply a new penalty"}
        </FormDescription>

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="rentLineId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Rent line</FormLabel>
                <div className="flex gap-1 items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter rent line id"
                      value={field.value || ""}
                      onChange={handleRentLineChange}
                      className="w-full"
                    />
                  </FormControl>

                  <LookUpButton setOpen={setRentLineLookupOpen} />

                  {isRentLineLookupOpen && (
                    <LookupRentLineDialog
                      open={isRentLineLookupOpen}
                      setOpen={setRentLineLookupOpen}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="penaltyId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Penalty</FormLabel>
                <div className="flex gap-1 items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter penalty id"
                      value={field.value || ""}
                      onChange={handlePenaltyChange}
                      className="w-full"
                    />
                  </FormControl>
                  <LookUpButton setOpen={setPenaltyLookupOpen} />

                  {isPenaltyLookupOpen && (
                    <LookupPenaltyDialog
                      open={isPenaltyLookupOpen}
                      setOpen={setPenaltyLookupOpen}
                    />
                  )}
                </div>
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
            backPath={
              pathname.includes("/rents") && pathname.includes("/rent-lines")
                ? `/rents/${rentId}/rent-lines/view/${rentLineId}`
                : pathname.includes("/rents") &&
                  !pathname.includes("/rent-lines")
                ? `/rents/view/${rentId}`
                : pathname.includes("/rent-lines") &&
                  !pathname.includes("/rents")
                ? `/rent-lines/view/${rentLineId}`
                : "/applied-penalties/all"
            }
            addPath={
              pathname.includes("/rents") && pathname.includes("/rent-lines")
                ? `/rents/${rentId}/rent-lines/${rentLineId}/applied-penalties/new`
                : pathname.includes("/rents") &&
                  !pathname.includes("/rent-lines")
                ? `/rents/${rentId}/applied-penalties/new`
                : pathname.includes("/rent-lines") &&
                  !pathname.includes("/rents")
                ? `/rent-lines/${rentLineId}/applied-penalties/new`
                : "/applied-penalties/new"
            }
            message={
              isUpdate
                ? "Applied penalty was successfully updated."
                : "Penalty was successfully applied."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default AppliedPenaltiesForm;
