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
import RelationType, {
  relationTypeDescription,
  RelationTypes,
} from "@/entities/Relation";
import useRelations from "@/hooks/use-relations";
import ApiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

// Define the Zod validation schema
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must not exceed 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address must not exceed 255 characters"),
  email: z.string().email("Invalid email address"),
  phonenumber: z
    .string()
    .min(1, "Phone number is required")
    .max(15, "Phone number must not exceed 15 characters")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  relationtype: z.nativeEnum(RelationTypes, {
    message: "Relation type is required",
  }),
});

const defaultValues: RelationType = {
  name: "",
  country: "",
  address: "",
  email: "",
  phonenumber: "",
  relationtype: RelationTypes.S,
};

const RelationsForm = () => {
  const queryClient = useQueryClient();
  const apiClient = new ApiClient<RelationType>("/relations");
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [relationId, setRelationId] = useState(id);
  const { data: relations } = useRelations();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (id && relations) {
      const relation = relations.find((r) => r.relationid === Number(id));
      if (relation) {
        form.reset(relation);
      }
    } else {
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, relations]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return await apiClient.update(id, values);
      }
      return await apiClient.create(values);
    },
    onSuccess: async (relation) => {
      setIsRedirectDialogOpen(true);
      toast.success(
        isUpdate ? (
          <span>
            Relation <span className="font-semibold"> {relation.name} </span>{" "}
            was successfully updated.
          </span>
        ) : (
          <span>
            Relation <span className="font-semibold"> {relation.name} </span>{" "}
            was successfully added
          </span>
        )
      );
      await queryClient.refetchQueries({ queryKey: ["relations"] });
      relation.relationid && setRelationId(relation.relationid.toString());
      if (!isUpdate) {
        form.reset(defaultValues);
      }
    },
    onError: (error) => {
      toast.error(
        isUpdate ? "Failed to update relation." : "Failed to add relation."
      );
      console.error("Error during mutation:", error);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutateAsync(values))}
        className="md:grid md:grid-cols-2 gap-4 mt-4 max-w-xl"
      >
        <FormDescription className="col-span-2">
          {isUpdate ? "Update the existing relation" : "Add a new relation"}
        </FormDescription>

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Full name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" />
              </FormControl>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Country</FormLabel>
              <FormControl>
                <Input {...field} placeholder="eg. Roumania" />
              </FormControl>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="123 Maplewood Drive, Pleasantville"
                />
              </FormControl>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Email address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john.doe@company.com"
                />
              </FormControl>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phonenumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Phone number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+39 xxx xxx xxx" />
              </FormControl>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationtype"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Relation type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a relation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationTypeDescription.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="col-span-1">
          <Button type="submit" disabled={isPending} className="mt-4 w-full">
            {isPending ? (
              <>
                <LoaderIcon className="animate-spin" />{" "}
                {isUpdate ? "Updating..." : "Submitting..."}
              </>
            ) : isUpdate ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {isRedirectDialogOpen && (
          <RedirectDialog
            open={isRedirectDialogOpen}
            setOpen={setIsRedirectDialogOpen}
            addPath={isUpdate ? "" : "/relations/new"}
            viewPath={`/relations/update/${relationId}`}
            backPath="/relations/all"
            message={
              isUpdate
                ? "Relation was successfully updated!"
                : "Relation was successfully added!"
            }
          />
        )}
      </form>
    </Form>
  );
};

export default RelationsForm;
