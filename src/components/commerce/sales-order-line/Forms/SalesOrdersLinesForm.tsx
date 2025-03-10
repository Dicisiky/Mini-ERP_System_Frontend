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
import SalesOrderLine from "@/entities/SalesOrderLine";
import useArticles from "@/hooks/use-articles";
import useSalesOrders from "@/hooks/use-sales-orders";
import LookUpButton from "@/components/partials/LookUpButton";
import LookUpArticleDialog from "@/components/master-data/articles/LookUpArticlesDialog";
import useArticleStore from "@/stores/article-store";
import useSalesOrderStore from "@/stores/sales-order-store";
import LookUpSalesOrderDialog from "../../sales-order/Lookups/LookUpSalesOrderDialog";
import useSalesOrdersLines from "@/hooks/use-sales-orders-lines";
import RedirectDialog from "@/components/partials/RedirectDialog";

const formSchema = z.object({
  salesOrderId: z.number().min(1, "Sales Order ID cannot be empty"),
  articleId: z.number().min(1, "Article ID cannot be empty"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be greater than 0"),
  totalLineAmount: z.number().min(0, "Total amount must be greater than 0"),
  totalLineAmountWithVAT: z
    .number()
    .min(0, "Total amount with VAT must be greater than 0"),
});

const defaultValues: z.infer<typeof formSchema> = {
  salesOrderId: 0,
  articleId: 0,
  quantity: 0,
  price: 0,
  totalLineAmount: 0,
  totalLineAmountWithVAT: 0,
};

const SalesOrderLineForm = () => {
  const [isArticleLookupOpen, setArticleLookupOpen] = useState(false);
  const [isSalesOrderLookupOpen, setSalesOrderLookupOpen] = useState(false);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id, salesOrderId } = useParams();
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [salesOrderLineId, setSalesOrderLineId] = useState(id);
  const { data: articles } = useArticles();
  const { data: salesOrders } = useSalesOrders();
  const { data: salesOrderLines } = useSalesOrdersLines();
  const { selectedArticle, setSelectedArticle, clearSelectedArticle } =
    useArticleStore();
  const { selectedSalesOrder, setSelectedSalesOrder, clearSelectedSalesOrder } =
    useSalesOrderStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleArticleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedArticle();
    const value = Number(e.target.value);
    form.setValue("articleId", value);

    const article = articles?.find((a) => a.articleid === value);
    if (article) {
      setSelectedArticle(article);
      form.setValue("price", article.price);
    }
  };

  const handleSalesOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedSalesOrder();
    const value = Number(e.target.value);
    form.setValue("salesOrderId", value);
    const salesOrder = salesOrders?.find((s) => s.salesOrderId === value);
    if (salesOrder) {
      setSelectedSalesOrder(salesOrder);
    }
  };

  // Auto calculated amounts
  const calculateAmounts = (
    price: number,
    quantity: number,
    vatRate: number
  ) => {
    const totalLineAmount = price * quantity;
    const vatAmount = totalLineAmount * (vatRate / 100);
    const totalLineAmountWithVAT = totalLineAmount + vatAmount;
    return { totalLineAmount, totalLineAmountWithVAT };
  };

  const price = form.watch("price");
  const quantity = form.watch("quantity");

  useEffect(() => {
    if (selectedArticle) {
      const { vatid } = selectedArticle;
      const vatRate = vatid.percent;
      const price = form.getValues("price");
      const quantity = form.getValues("quantity");

      const { totalLineAmount, totalLineAmountWithVAT } = calculateAmounts(
        price,
        quantity,
        vatRate
      );

      form.setValue("totalLineAmount", totalLineAmount);
      form.setValue("totalLineAmountWithVAT", totalLineAmountWithVAT);
    }
  }, [selectedArticle, price, quantity]);

  useEffect(() => {
    const oldSelectedArticle = form.getValues("articleId");
    const oldSelectedSalesOrder = form.getValues("salesOrderId");

    if (selectedArticle?.articleid) {
      if (oldSelectedArticle !== selectedArticle.articleid) {
        form.setValue("articleId", selectedArticle.articleid);
        form.setValue("price", selectedArticle.price);
      }
    } else {
      form.setValue("articleId", 0);
    }

    if (selectedSalesOrder?.salesOrderId) {
      if (oldSelectedSalesOrder !== selectedSalesOrder.salesOrderId)
        form.setValue("salesOrderId", selectedSalesOrder.salesOrderId);
    } else {
      form.setValue("salesOrderId", 0);
    }
  }, [selectedArticle, selectedSalesOrder]);

  useEffect(() => {
    if (id && salesOrderLines) {
      const salesOrderLine = salesOrderLines.find(
        (sol) => sol.salesOrderLineId === Number(id)
      );
      if (salesOrderLine) {
        form.reset({
          ...salesOrderLine,
          articleId: salesOrderLine.article.articleid,
          salesOrderId: salesOrderLine.salesOrder.salesOrderId,
        });

        const article = articles?.find(
          (a) => a.articleid === salesOrderLine.article.articleid
        );
        if (article) setSelectedArticle(article);
        const order = salesOrders?.find(
          (so) => so.salesOrderId === Number(salesOrderLine.salesOrderId)
        );
        if (order) setSelectedSalesOrder(order);
      }
      setIsUpdate(pathname.includes("update"));
    } else {
      const currentSalesOrder = salesOrders?.find(
        (so) => so.salesOrderId === Number(salesOrderId)
      );
      form.reset({
        ...defaultValues,
        ...(currentSalesOrder
          ? { salesOrderId: currentSalesOrder.salesOrderId }
          : null),
      });

      // ############## if the salesOrderId is present in the pathname parameters, then set the selected sales order in the store ##############
      if (currentSalesOrder) setSelectedSalesOrder(currentSalesOrder);
    }
  }, [id, pathname, salesOrderLines, salesOrders, articles]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        const apiClient = new ApiClient<SalesOrderLine>(
          "/sales-order-lines/update"
        );
        return await apiClient.update(id, {
          ...values,
          salesOrderLineId: Number(id),
          article: { articleid: values.articleId },
          salesOrder: { salesOrderId: values.salesOrderId },
        });
      }
      const apiClient = new ApiClient<SalesOrderLine>("/sales-order-lines");
      return await apiClient.create({
        ...values,
        article: { articleid: values.articleId },
        salesOrder: { salesOrderId: values.salesOrderId },
      });
    },
    onSuccess: async (salesOrderLine) => {
      setRedirectDialogOpen(true);
      salesOrderLine &&
        salesOrderLine.salesOrderLineId &&
        setSalesOrderLineId(salesOrderLine.salesOrderLineId.toString());
      [
        ["sales-orders"],
        ["sales-order-lines"],
        ["sales-order"],
        ["sales-order-line"],
      ].map(async (queryKey) => await queryClient.refetchQueries({ queryKey }));
      toast.success(
        <span>
          Sales order line{" "}
          <span className="font-semibold">
            {salesOrderLine.salesOrderLineId}
          </span>{" "}
          was succseffully
          {isUpdate ? " updated" : " added"}
        </span>
      );
      clearSelectedArticle();
      clearSelectedSalesOrder();
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Sales Order Line could not be updated."
          : "Sales Order Line could not be added."
      );
      console.error("Error during mutation:", error);
    },
  });

  useEffect(() => {
    return () => {
      clearSelectedArticle();
      clearSelectedSalesOrder();
    };
  }, [pathname]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-6 mt-5 max-w-lg"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="salesOrderId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Sales Order</FormLabel>
                <div className="flex gap-1 items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter sales order id"
                      value={field.value || ""}
                      onChange={handleSalesOrderChange}
                      className="w-full"
                    />
                  </FormControl>
                  <LookUpButton setOpen={setSalesOrderLookupOpen} />
                  {isSalesOrderLookupOpen && (
                    <LookUpSalesOrderDialog
                      open={isSalesOrderLookupOpen}
                      setOpen={setSalesOrderLookupOpen}
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
                    <LookUpArticleDialog
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

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Quantity</FormLabel>
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Price</FormLabel>
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
          name="totalLineAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Total Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value || 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled
                  className="w-full bg-gray-200 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalLineAmountWithVAT"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">
                Total Amount with VAT
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value || 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled
                  className="w-full bg-gray-200 cursor-not-allowed"
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
            backPath={
              salesOrderId
                ? `/sales-orders/view/${salesOrderId}`
                : "/sales-order-lines/all"
            }
            viewPath={
              salesOrderId
                ? `/sales-orders/${salesOrderId}/sales-order-lines/view/${salesOrderLineId}`
                : `/sales-order-lines/view/${salesOrderLineId}`
            }
            addPath={
              !isUpdate
                ? salesOrderId
                  ? `/sales-orders/${salesOrderId}/sales-order-lines/new`
                  : `/sales-order-lines/new`
                : ""
            }
            message={
              isUpdate
                ? "Sales order line was successfully updated."
                : "Sales order line was successfully created."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default SalesOrderLineForm;
