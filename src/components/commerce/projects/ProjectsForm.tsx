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
import Project, { ProjectType, projectTypeOptions } from "@/entities/Project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProjects from "@/hooks/use-projects";
import { Switch } from "../../ui/switch";
import DatePicker from "../../partials/DatePicker";
import { useNavigate } from "react-router-dom";
import LookUpCustomerDialog from "../../master-data/relations/LookUpCustomersDialog";
import LookUpButton from "../../partials/LookUpButton";
import useRelationStore from "@/stores/relation-store";
import { useCustomers } from "@/hooks/use-relations";

const formSchema = z
  .object({
    customerId: z.number().min(1, "Customer id cannot be empty"),
    startDate: z.date(),
    endDate: z.date(),
    projectType: z.nativeEnum(ProjectType, {
      required_error: "Project type is required",
    }),
    budget: z.number().min(0, "Budget must be greater than 0"),
    isInBudget: z.boolean(),
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date cannot be earlier than start date.",
    path: ["endDate"],
  });

const defaultValues: z.infer<typeof formSchema> = {
  customerId: 0,
  startDate: new Date(),
  endDate: new Date(),
  projectType: ProjectType.C,
  budget: 0,
  isInBudget: false,
};

const ProjectsForm = () => {
  const [isCustomerLookupOpen, setCustomerLookupOpen] = useState(false);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const apiClient = new ApiClient<Project>("/projects");
  const { data: projects } = useProjects();
  const { customers } = useCustomers();
  const navigate = useNavigate();
  const { selectedRelation, setSelectedRelation, clearSelectedRelation } =
    useRelationStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // sync project form with Relation store when customer value is changed manually
  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedRelation();
    const value = Number(e.target.value);
    form.setValue("customerId", value);
    const customer = customers?.find((c) => c.relationid === value);
    if (customer) {
      setSelectedRelation(customer);
    }
  };

  // sync project form with relation store when customer is changed from pick-up
  useEffect(() => {
    const oldSelectedCustomer = form.getValues("customerId");
    if (selectedRelation?.relationid) {
      if (oldSelectedCustomer !== selectedRelation.relationid)
        form.setValue("customerId", selectedRelation.relationid);
    } else {
      form.setValue("customerId", 0);
    }
  }, [selectedRelation]);

  // load form data and set isUpdate state when project id is present
  useEffect(() => {
    if (id && projects) {
      const project = projects.find((p) => p.projectId === Number(id));
      if (project) {
        form.reset({
          ...project,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate),
          customerId: project.customerId.relationid,
        });

        const projectCustomer = customers?.find(
          (c) => c.relationid === project.customerId.relationid
        );

        if (projectCustomer) setSelectedRelation(projectCustomer);
      }
    } else {
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, projects, customers]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return apiClient.update(id, {
          ...values,
          customerId: { relationid: values.customerId },
          projectId: Number(id),
        });
      }
      return apiClient.create({
        ...values,
        customerId: { relationid: values.customerId },
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["projects"] });

      if (isUpdate) {
        toast.success("Project was successfully updated.");
        navigate("/projects/all");
      } else {
        toast.success("Project was successfully added.");
        form.reset(defaultValues);
      }
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Project could not be updated."
          : "Project could not be added."
      );
      console.error("Error during mutation:", error);
    },
    onSettled: () => {
      clearSelectedRelation();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-6 mt-5 max-w-lg"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Project type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypeOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
        </div>

        <div className="flex flex-col md:flex-row gap-3">
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

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Budget</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isInBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">
                Is in budget?
              </FormLabel>
              <FormControl className="flex">
                <Switch
                  className="cursor-not-allowed"
                  title="Is in budget will be calculated based on the budget"
                  aria-readonly={true}
                  checked={field.value}
                  // onCheckedChange={(checked) => field.onChange(checked)}
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
      </form>
    </Form>
  );
};

export default ProjectsForm;
