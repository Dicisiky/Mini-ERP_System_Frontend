import { useEffect, useState } from "react";
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
import ApiClient from "@/services/api-client";
import Category from "@/entities/Category";
import useCategories from "@/hooks/use-categories";
import { Textarea } from "@/components/ui/textarea";
import RedirectDialog from "@/components/partials/RedirectDialog";

const formSchema = z.object({
  name: z
    .string()
    .nonempty("Name cannot be empty")
    .max(100, "Name must be less than or equal to 100 characters"),

  description: z
    .string()
    .nonempty("Description cannot be empty")
    .max(255, "Description must be less than or equal to 255 characters"),
});

const defaultValues = {
  name: "",
  description: "",
};

const CategoryForm = () => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const { data: categories } = useCategories();
  const apiClient = new ApiClient<Category>("/categories");
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [categoryId, setCateryId] = useState(id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (id && categories) {
      const category = categories.find((c) => c.categoryid === Number(id));
      if (category) {
        form.reset(category);
      }
    } else {
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, categories]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return apiClient.update(id, { categoryid: Number(id), ...values });
      }
      return apiClient.create(values);
    },
    onSuccess: async (category) => {
      setIsRedirectDialogOpen(true);
      toast.success(
        isUpdate ? (
          <span>
            Category <span className="font-semibold">{category.name}</span> was
            successfully updated.
          </span>
        ) : (
          <span>
            Category <span className="font-semibold">{category.name}</span> was
            successfully created.
          </span>
        )
      );
      [["categories"], ["articles"]].map(
        async (queryKey) => await queryClient.refetchQueries({ queryKey })
      );

      if (!isUpdate) {
        form.reset(defaultValues);
      }

      category.categoryid && setCateryId(category.categoryid.toString());
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Category could not be updated."
          : "Category could not be added."
      );
      console.error("Error during mutation:", error);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-4 mt-5 md:max-w-lg"
      >
        <FormDescription>
          {isUpdate
            ? "Update the existing article category"
            : "Add a new article category"}
        </FormDescription>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g. Forklifts" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Lifting pallets" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
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
            addPath={isUpdate ? "" : "/categories/new"}
            viewPath={`/categories/update/${categoryId}`}
            backPath="/categories/all"
            message={
              isUpdate
                ? "Category was successfully updated!"
                : "Category was successfully added!"
            }
          />
        )}
      </form>
    </Form>
  );
};

export default CategoryForm;
