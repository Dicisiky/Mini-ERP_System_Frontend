import NewPurchaseOrderLineBreadcrumb from "@/components/commerce/purchase-order-line/breadcrumbs/NewPurchaseOrderLineBreadcrumb";
import PurchaseOrderLineForm from "@/components/commerce/purchase-order-line/Forms/PurchaseOrdersLinesForm";
import PageSection from "@/components/partials/PageSection";

const NewPurchaseOrderLine = () => {
  return (
    <PageSection>
      <NewPurchaseOrderLineBreadcrumb />
      <PurchaseOrderLineForm />
    </PageSection>
  );
};

export default NewPurchaseOrderLine;
