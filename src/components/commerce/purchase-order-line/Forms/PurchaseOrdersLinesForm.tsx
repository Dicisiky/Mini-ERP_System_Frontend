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
import PurchaseOrderLine from "@/entities/PurchaseOrderLine";
import useArticles from "@/hooks/use-articles";
import usePurchaseOrders from "@/hooks/use-purchase-orders";
import LookUpButton from "@/components/partials/LookUpButton";
import LookUpArticleDialog from "@/components/master-data/articles/LookUpArticlesDialog";
import useArticleStore from "@/stores/article-store";
import usePurchaseOrderStore from "@/stores/purchase-order-store";
import LookUpPurchaseOrderDialog from "../../purchase-order/Lookups/LookUpPurchaseOrderDialog";
import usePurchaseOrdersLines from "@/hooks/use-purchase-orders-lines";
import RedirectDialog from "@/components/partials/RedirectDialog";

const formSchema = z.object({
  purchaseOrderId: z.number().min(1, "Purchase order ID cannot be empty"),
  articleId: z.number().min(1, "Article ID cannot be empty"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be greater than 0"),
  totalLineAmount: z.number().min(0, "Total amount must be greater than 0"),
  totalLineAmountWithVAT: z
    .number()
    .min(0, "Total amount with VAT must be greater than 0"),
});

const defaultValues: z.infer<typeof formSchema> = {
  purchaseOrderId: 0,
  articleId: 0,
  quantity: 0,
  price: 0,
  totalLineAmount: 0,
  totalLineAmountWithVAT: 0,
};

const PurchaseOrderLineForm = () => {
  const [isArticleLookupOpen, setArticleLookupOpen] = useState(false);
  const [isPurchaseOrderLookupOpen, setPurchaseOrderLookupOpen] =
    useState(false);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const { id, purchaseOrderId } = useParams();
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [purchaseOrderLineId, setPurchaseOrderLineId] = useState(id);
  const { data: articles } = useArticles();
  const { data: purchaseOrders } = usePurchaseOrders();
  const { data: purchaseOrderLines } = usePurchaseOrdersLines();
  const { selectedArticle, setSelectedArticle, clearSelectedArticle } =
    useArticleStore();
  const {
    selectedPurchaseOrder,
    setSelectedPurchaseOrder,
    clearSelectedPurchaseOrder,
  } = usePurchaseOrderStore();

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

  const handlePurchaseOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearSelectedPurchaseOrder();
    const value = Number(e.target.value);
    form.setValue("purchaseOrderId", value);
    const purchaseOrder = purchaseOrders?.find(
      (p) => p.purchaseOrderId === value
    );
    if (purchaseOrder) {
      setSelectedPurchaseOrder(purchaseOrder);
    }
  };

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
    const oldSelectedPurchaseOrder = form.getValues("purchaseOrderId");

    if (selectedArticle?.articleid) {
      if (oldSelectedArticle !== selectedArticle.articleid) {
        form.setValue("articleId", selectedArticle.articleid);
        form.setValue("price", selectedArticle.price);
      }
    } else {
      form.setValue("articleId", 0);
    }

    if (selectedPurchaseOrder?.purchaseOrderId) {
      if (oldSelectedPurchaseOrder !== selectedPurchaseOrder.purchaseOrderId)
        form.setValue("purchaseOrderId", selectedPurchaseOrder.purchaseOrderId);
    } else {
      form.setValue("purchaseOrderId", 0);
    }
  }, [selectedArticle, selectedPurchaseOrder]);

  useEffect(() => {
    if (id && purchaseOrderLines) {
      const purchaseOrderLine = purchaseOrderLines.find(
        (pol) => pol.purchaseOrderLineId === Number(id)
      );
      if (purchaseOrderLine) {
        form.reset({
          ...purchaseOrderLine,
          articleId: purchaseOrderLine.article.articleid,
          purchaseOrderId: purchaseOrderLine.purchaseOrder.purchaseOrderId,
        });

        const article = articles?.find(
          (a) => a.articleid === purchaseOrderLine.article.articleid
        );
        if (article) setSelectedArticle(article);
        const order = purchaseOrders?.find(
          (po) =>
            po.purchaseOrderId === Number(purchaseOrderLine.purchaseOrderId)
        );
        if (order) setSelectedPurchaseOrder(order);
      }
      setIsUpdate(pathname.includes("update"));
    } else {
      const currentPurchaseOrder = purchaseOrders?.find(
        (po) => po.purchaseOrderId === Number(purchaseOrderId)
      );
      form.reset({
        ...defaultValues,
        ...(currentPurchaseOrder
          ? { purchaseOrderId: currentPurchaseOrder.purchaseOrderId }
          : null),
      });

      if (currentPurchaseOrder) setSelectedPurchaseOrder(currentPurchaseOrder);
    }
  }, [id, pathname, purchaseOrderLines, purchaseOrders, articles]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isUpdate && id) {
        const apiClient = new ApiClient<PurchaseOrderLine>(
          "/purchase-order-lines/update"
        );
        return await apiClient.update(id, {
          ...values,
          purchaseOrderLineId: Number(id),
          article: { articleid: values.articleId },
          purchaseOrder: { purchaseOrderId: values.purchaseOrderId },
        });
      }
      const apiClient = new ApiClient<PurchaseOrderLine>(
        "/purchase-order-lines"
      );
      return await apiClient.create({
        ...values,
        article: { articleid: values.articleId },
        purchaseOrder: { purchaseOrderId: values.purchaseOrderId },
      });
    },
    onSuccess: async (purchaseOrderLine) => {
      setRedirectDialogOpen(true);
      purchaseOrderLine &&
        purchaseOrderLine.purchaseOrderLineId &&
        setPurchaseOrderLineId(
          purchaseOrderLine.purchaseOrderLineId.toString()
        );
      [
        ["purchase-orders"],
        ["purchase-order-lines"],
        ["purchase-order"],
        ["purchase-order-line"],
      ].map(async (queryKey) => await queryClient.refetchQueries({ queryKey }));
      toast.success(
        <span>
          Purchase order line{" "}
          <span className="font-semibold">
            {purchaseOrderLine.purchaseOrderLineId}
          </span>{" "}
          was successfully
          {isUpdate ? " updated" : " added"}
        </span>
      );
      clearSelectedArticle();
      clearSelectedPurchaseOrder();
    },
    onError: (error) => {
      toast.error(
        isUpdate
          ? "Purchase order line could not be updated."
          : "Purchase order line could not be added."
      );
      console.error("Error during mutation:", error);
    },
  });

  useEffect(() => {
    return () => {
      clearSelectedArticle();
      clearSelectedPurchaseOrder();
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
            name="purchaseOrderId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-black">Purchase Order</FormLabel>
                <div className="flex gap-1 items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter purchase order id"
                      value={field.value || ""}
                      onChange={handlePurchaseOrderChange}
                      className="w-full"
                    />
                  </FormControl>
                  <LookUpButton setOpen={setPurchaseOrderLookupOpen} />
                  {isPurchaseOrderLookupOpen && (
                    <LookUpPurchaseOrderDialog
                      open={isPurchaseOrderLookupOpen}
                      setOpen={setPurchaseOrderLookupOpen}
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
              <FormLabel className="text-black">Total amount</FormLabel>
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
                Total amount with VAT
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

        <Button
          disabled={isPending}
          type="submit"
          className="flex gap-3 w-full md:w-auto"
        >
          {isPending && <LoaderIcon className="animate-spin" />}
          <span>{isUpdate ? "Update" : "Add"} Purchase Order Line</span>
        </Button>

        {isRedirectDialogOpen && (
          <RedirectDialog
            open={isRedirectDialogOpen}
            setOpen={setRedirectDialogOpen}
            backPath={
              purchaseOrderId
                ? `/purchase-orders/view/${purchaseOrderId}`
                : "/purchase-order-lines/all"
            }
            viewPath={
              purchaseOrderId
                ? `/purchase-orders/${purchaseOrderId}/purchase-order-lines/view/${purchaseOrderLineId}`
                : `/purchase-order-lines/view/${purchaseOrderLineId}`
            }
            addPath={
              !isUpdate
                ? purchaseOrderId
                  ? `/purchase-orders/${purchaseOrderId}/purchase-order-lines/new`
                  : `/purchase-order-lines/new`
                : ""
            }
            message={
              isUpdate
                ? "Purchase order line was successfully updated."
                : "Purchase order line was successfully created."
            }
          />
        )}
      </form>
    </Form>
  );
};

export default PurchaseOrderLineForm;
