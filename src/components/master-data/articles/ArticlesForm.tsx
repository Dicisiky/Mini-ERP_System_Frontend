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
import { z } from "zod";
import { ChangeEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ApiClient from "@/services/api-client";
import ArticleType from "@/entities/Article";
import UMTypes, { umTypeOptions } from "@/entities/UMTypes";
import LookUpCategoryDialog from "../categories/LookUpCategoryDialog";
import LookUpVatRateDialog from "../vat-rates/LookUpVatRateDialog";
import LookUpButton from "@/components/partials/LookUpButton";
import { FormDescription } from "@/components/ui/form";
import useArticles from "@/hooks/use-articles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import useCategoryStore from "@/stores/category-store";
import useVatRateStore from "@/stores/vat-rate-store";
import useVatRates from "@/hooks/use-vatrates";
import useCategories from "@/hooks/use-categories";
import { Textarea } from "@/components/ui/textarea";
import RedirectDialog from "@/components/partials/RedirectDialog";

// Define the Zod validation schema
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Article name is required")
    .max(100, "Article name must not exceed 100 characters"),

  description: z
    .string()
    .min(1, "Article description is required")
    .max(255, "Article description must not exceed 255 characters"),

  price: z
    .number({
      invalid_type_error: "Article price must be a number",
    })
    .min(0, "Article price must be at least 0")
    .max(10000, "Article price must not exceed 10000"),

  um: z.nativeEnum(UMTypes, {
    message: "Article unit of measure is required",
  }),

  categoryid: z
    .number({
      invalid_type_error: "Article category id must be a number",
    })
    .min(1, "Article category is required"),

  vatid: z
    .number({
      invalid_type_error: "VAT rate id must be a number",
    })
    .min(1, "VAT rate is required"),
});

const defaultValues = {
  name: "",
  description: "",
  price: 0,
  um: UMTypes.PIECES,
  categoryid: 0,
  vatid: 0,
};

const ArticleForm = () => {
  const [isCategoryLookupOpen, setCategoryLookupOpen] = useState(false);
  const [isVatLookupOpen, setVatLookupOpen] = useState(false);
  const queryClient = useQueryClient();
  const apiClient = new ApiClient<ArticleType>("/articles");
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [articleId, setArticleId] = useState(id);
  const { data: articles } = useArticles();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { data: categories } = useCategories();
  const { data: vatRates } = useVatRates();

  const { selectedCategory, setSelectedCategory, clearSelectedCategory } =
    useCategoryStore();
  const { selectedVatRate, setSelectedVatRate, clearSelectedVatRate } =
    useVatRateStore();

  // sync article form with Category store when Category value is changed manually
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedCategory();
    const value = Number(e.target.value);
    form.setValue("categoryid", value);
    const category = categories?.find((c) => c.categoryid === value);
    if (category) {
      setSelectedCategory(category);
    }
  };

  // sync article form with vat rate store when VAT Rate is changed manually
  const handleVatRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedVatRate();
    const value = Number(e.target.value);
    form.setValue("vatid", value);
    const vatRate = vatRates?.find((v) => v.vatid === value);
    if (vatRate) {
      setSelectedVatRate(vatRate);
    }
  };

  // sync article form with category and vat rate stores when values are changed from pick-up
  useEffect(() => {
    const oldSelectedCategory = form.getValues("categoryid");
    const oldSelectedVatRate = form.getValues("vatid");

    if (selectedVatRate?.vatid) {
      if (oldSelectedVatRate !== selectedVatRate.vatid)
        form.setValue("vatid", selectedVatRate.vatid);
    } else {
      form.setValue("vatid", 0);
    }

    if (selectedCategory?.categoryid) {
      if (oldSelectedCategory !== selectedCategory.categoryid)
        form.setValue("categoryid", selectedCategory.categoryid);
    } else {
      form.setValue("categoryid", 0);
    }
  }, [selectedVatRate, selectedCategory]);

  useEffect(() => {
    if (id && articles) {
      // load the form data and sync with category and vat rate stores in edit mode
      const article = articles.find((a) => a.articleid === Number(id));
      if (article) {
        const { categoryid, vatid } = article;
        form.reset({
          ...article,
          categoryid: categoryid.categoryid,
          vatid: vatid.vatid,
        });

        const articleCategory = categories?.find(
          (c) => c.categoryid === article.categoryid.categoryid
        );

        if (articleCategory) setSelectedCategory(articleCategory);

        const articleVatRate = vatRates?.find(
          (v) => v.vatid === article.vatid.vatid
        );

        if (articleVatRate) setSelectedVatRate(articleVatRate);
      }
    } else {
      // reset form fields in create mode
      form.reset(defaultValues);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, articles, categories, vatRates]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        return await apiClient.update(id, {
          articleid: Number(id),
          ...values,
          categoryid: { categoryid: values.categoryid },
          vatid: { vatid: values.vatid },
        });
      }
      return await apiClient.create({
        ...values,
        categoryid: { categoryid: values.categoryid },
        vatid: { vatid: values.vatid },
      });
    },
    onSuccess: async (article) => {
      setIsRedirectDialogOpen(true);
      const apiClient = new ApiClient("/stocks/create");
      !isUpdate && (await apiClient.create(article));
      await queryClient.refetchQueries({ queryKey: ["articles"] });
      await queryClient.refetchQueries({ queryKey: ["stocks"] });
      if (isUpdate) {
        toast.success(
          <span>
            Article <span className="font-semibold">{article.name}</span> was
            successfully updated.
          </span>
        );
      } else {
        form.reset(defaultValues);
        toast.success(
          <span>
            Article <span className="font-semibold">{article.name}</span> was
            successfully created.
          </span>
        );
        article.articleid && setArticleId(article.articleid.toString());
      }
    },
    onError: (error) => {
      toast.error(
        isUpdate ? "Failed to update article." : "Failed to add article."
      );
      console.error("Error during mutation:", error);
    },
  });

  useEffect(() => {
    return () => {
      clearSelectedCategory();
      clearSelectedVatRate();
    };
  }, [pathname]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutateAsync(values))}
        className="flex flex-col md:grid sm:grid-cols-2 gap-4 mt-5 max-w-lg"
      >
        <div className="col-span-2">
          <FormDescription>
            {pathname.includes("update")
              ? "Update the existing article"
              : "Add a new article"}
          </FormDescription>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-black">Article name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Concrete Mixer" />
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
          name="description"
          render={({ field, fieldState }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-black">Article description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g. High-capacity concrete mixer"
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
          name="price"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Article price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter article price (e.g. 1200)"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
          name="um"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Unit of measure</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select penalty type" />
                  </SelectTrigger>
                  <SelectContent>
                    {umTypeOptions.map((option) => (
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

        <FormField
          control={form.control}
          name="categoryid"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Article category</FormLabel>
              <div className="flex gap-1 items-center">
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter category id"
                    value={field.value || ""}
                    onChange={handleCategoryChange}
                  />
                </FormControl>
                <LookUpButton setOpen={setCategoryLookupOpen} />

                {isCategoryLookupOpen && (
                  <LookUpCategoryDialog
                    open={isCategoryLookupOpen}
                    setOpen={setCategoryLookupOpen}
                  />
                )}
              </div>
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
          name="vatid"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-black">Article VAT rate</FormLabel>
              <div className="flex gap-1 items-center">
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter VAT rate"
                    value={field.value || ""}
                    onChange={handleVatRateChange}
                  />
                </FormControl>
                <LookUpButton setOpen={setVatLookupOpen} />

                {isVatLookupOpen && (
                  <LookUpVatRateDialog
                    open={isVatLookupOpen}
                    setOpen={setVatLookupOpen}
                  />
                )}
              </div>
              {fieldState?.error && (
                <FormMessage className="text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="col-span-1">
          <Button type="submit" disabled={isPending} className="mt-2 w-full">
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
        </div>
        {isRedirectDialogOpen && (
          <RedirectDialog
            open={isRedirectDialogOpen}
            setOpen={setIsRedirectDialogOpen}
            addPath={isUpdate ? "" : "/articles/new"}
            viewPath={`/articles/update/${articleId}`}
            backPath="/articles/all"
            message={
              isUpdate
                ? "Article was successfully updated!"
                : "Article was successfully added!"
            }
          />
        )}
      </form>
    </Form>
  );
};

export default ArticleForm;
