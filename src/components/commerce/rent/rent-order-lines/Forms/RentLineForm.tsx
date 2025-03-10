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
import ApiClient from "@/services/api-client";
import LookUpButton from "@/components/partials/LookUpButton";
import RentLine from "@/entities/RentLine";
import LookupArticleDialog from "@/components/master-data/articles/LookUpArticlesDialog";
import useRentStore from "@/stores/rent-store";
import useArticleStore from "@/stores/article-store";
import useRents from "@/hooks/use-rents";
import useArticles from "@/hooks/use-articles";
import useRentLines from "@/hooks/use-rent-lines";
import LookupRentDialog from "../../rent-order/Lookups/LookupRentDialog";
import RedirectDialog from "@/components/partials/RedirectDialog";

const formSchema = z.object({
  rentId: z
    .number({
      invalid_type_error: "Rent id must be a number",
    })
    .min(1, "Rent id is required"),

  articleId: z
    .number({
      invalid_type_error: "Article id must be a valid number",
    })
    .min(1, "Article id is required"),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a valid number",
    })
    .min(1, "Quantity is required"),

  pricePerDay: z
    .number({
      required_error: "Price per day is required",
      invalid_type_error: "Price per day must be a valid number",
    })
    .min(1, "Price per day is required"),
});

const defaultValues: z.infer<typeof formSchema> = {
  rentId: 0,
  articleId: 0,
  quantity: 0,
  pricePerDay: 0,
};

const RentLineForm = () => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isArticleLookupOpen, setArticleLookupOpen] = useState(false);
  const [isRentLookupOpen, setRentLookupOpen] = useState(false);
  const { rentId, id } = useParams();
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [rentLineId, setRentLineId] = useState(id);
  const { data: rents } = useRents();
  const { data: articles } = useArticles();
  const { data: rentLines } = useRentLines();
  const { selectedRent, setSelectedRent, clearSelectedRent } = useRentStore();
  const { selectedArticle, setSelectedArticle, clearSelectedArticle } =
    useArticleStore();

  // ############## declare new instance of form ##############
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // ############## sync rent line form with rent store when rent value is changed manually ##############
  const handleRentChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedRent();
    const value = Number(e.target.value);
    form.setValue("rentId", value);
    const rent = rents?.find((r) => r.rentId === value);
    if (rent) {
      setSelectedRent(rent);
    }
  };

  // ############## sync rent line form with article store when article is changed manually ##############
  const handleArticleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedArticle();
    const value = Number(e.target.value);
    form.setValue("articleId", value);
    const article = articles?.find((a) => a.articleid === value);
    if (article) {
      setSelectedArticle(article);
    }
  };

  useEffect(() => {
    if (id && rentLines) {
      // ############## load the form data and sync with article and rent stores in edit mode ##############
      const rentLine = rentLines.find((r) => r.rentLineId === Number(id));
      if (rentLine) {
        form.reset({
          ...rentLine,
          rentId: rentLine.rent.rentId,
          articleId: rentLine.article.articleid,
        });

        const rentLineHeader = rents?.find(
          (r) => r.rentId === rentLine.rent.rentId
        );

        if (rentLineHeader) setSelectedRent(rentLineHeader);

        const rentLineArticle = articles?.find(
          (a) => a.articleid === rentLine.article.articleid
        );

        if (rentLineArticle) setSelectedArticle(rentLineArticle);
      }
    } else {
      // ############## reset form fields in create mode ##############
      const currentRent = rents?.find((r) => r.rentId === Number(rentId));
      form.reset({
        ...defaultValues,
        ...(currentRent ? { rentId: currentRent.rentId } : null),
      });

      // ############## if the rentId is present in the pathname parameters, then set the selected rent in the store ##############
      if (currentRent) setSelectedRent(currentRent);
    }
    setIsUpdate(pathname.includes("update"));
  }, [id, articles, rentLines, rents, rentId]);

  // ############## sync rent line form with rent and article stores when values are changed from pick-up ##############
  useEffect(() => {
    const oldSelectedRent = form.getValues("rentId");
    const oldSelectedArticle = form.getValues("articleId");

    if (selectedRent?.rentId) {
      if (oldSelectedRent !== selectedRent.rentId)
        form.setValue("rentId", selectedRent.rentId);
    } else {
      form.setValue("rentId", 0);
    }

    if (selectedArticle?.articleid) {
      if (oldSelectedArticle !== selectedArticle.articleid)
        form.setValue("articleId", selectedArticle.articleid);
    } else {
      form.setValue("articleId", 0);
    }
  }, [selectedArticle, selectedRent]);

  // ############## mutation function (GET/PUT request) ##############
  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        const apiClient = new ApiClient<RentLine>("/rentlines/update");
        return await apiClient.update(id, {
          ...values,
          rent: { rentId: values.rentId },
          article: { articleid: values.articleId },
        });
      }

      const apiClient = new ApiClient<RentLine>("/rentlines/create");

      return await apiClient.create({
        ...values,
        rent: { rentId: values.rentId },
        article: { articleid: values.articleId },
      });
    },
    onSuccess: async (rentLine) => {
      // ############## clear the stored values and show success notifications notifications
      clearSelectedArticle();
      clearSelectedRent();
      setRedirectDialogOpen(true);
      if (isUpdate) {
        toast.success("Rent line was successfully updated!");
      } else {
        rentLine.rentLineId && setRentLineId(rentLine.rentLineId.toString());
        toast.success("Rent line was successfully created!");
        form.reset(defaultValues);
      }

      await Promise.all(
        [["rents"], ["rent", rentId], ["rent-lines"], ["rent-order-lines"]].map(
          (queryKey) => queryClient.refetchQueries({ queryKey })
        )
      );
    },
    onError: (error) => {
      // ############ show error notification and log the error ############
      toast.error(
        isUpdate
          ? "Rent line could not be updated."
          : "Rent line could not be added."
      );
      console.error("Error during mutation:", error);
    },
  });

  // ############ clean-up stored values when the component unmounts (user navigates away) ############
  useEffect(() => {
    return () => {
      clearSelectedArticle();
      clearSelectedRent();
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

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="rentId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Rent id</FormLabel>
                <div className="flex gap-1 items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter rent id"
                      value={field.value || ""}
                      onChange={handleRentChange}
                      className="w-full"
                    />
                  </FormControl>

                  <LookUpButton setOpen={setRentLookupOpen} />

                  {isRentLookupOpen && (
                    <LookupRentDialog
                      open={isRentLookupOpen}
                      setOpen={setRentLookupOpen}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="articleId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Article</FormLabel>
                <div className="flex gap-1 items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter article id"
                      value={field.value || ""}
                      onChange={handleArticleChange}
                      className="w-full"
                    />
                  </FormControl>
                  <LookUpButton setOpen={setArticleLookupOpen} />

                  {isArticleLookupOpen && (
                    <LookupArticleDialog
                      open={isArticleLookupOpen}
                      setOpen={setArticleLookupOpen}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter quantity to rent"
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
            name="pricePerDay"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Price per day</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter price per day"
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
            backPath={rentId ? `/rents/view/${rentId}` : `/rent-lines/all`}
            viewPath={
              rentId
                ? `/rents/${rentId}/rent-lines/view/${rentLineId}`
                : `/rent-lines/view/${rentLineId}`
            }
            addPath={
              !isUpdate
                ? rentId
                  ? `/rents/${rentId}/rent-lines/new`
                  : `/rent-lines/new`
                : ""
            }
            message={
              isUpdate
                ? "Rent line was successfully updated."
                : "Rent line was successfully created."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default RentLineForm;
