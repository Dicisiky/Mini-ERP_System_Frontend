import NewPurchaseOrderLineFromHeaderBreadcrumb from "@/components/commerce/purchase-order-line/breadcrumbs/NewPurchaseOrderLineFromHeaderBreadcrumb";
import PurchaseOrderLineForm from "@/components/commerce/purchase-order-line/Forms/PurchaseOrdersLinesForm";
import PageSection from "@/components/partials/PageSection";

const NewPurchaseOrderLineFromHeader = () => {
  return (
    <PageSection>
      <NewPurchaseOrderLineFromHeaderBreadcrumb />
      <PurchaseOrderLineForm />
    </PageSection>
  );
};

export default NewPurchaseOrderLineFromHeader;
