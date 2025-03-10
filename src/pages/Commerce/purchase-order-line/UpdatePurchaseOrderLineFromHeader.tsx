import UpdatePurchaseOrderLineFromHeaderBreadcrumb from "@/components/commerce/purchase-order-line/breadcrumbs/UpdatePurchaseOrderLineFromHeaderBreadcrumb";
import PurchaseOrderLineForm from "@/components/commerce/purchase-order-line/Forms/PurchaseOrdersLinesForm";
import PageSection from "@/components/partials/PageSection";

const UpdatePurchaseOrderLineFromHeader = () => {
  return (
    <PageSection>
      <UpdatePurchaseOrderLineFromHeaderBreadcrumb />
      <PurchaseOrderLineForm />
    </PageSection>
  );
};

export default UpdatePurchaseOrderLineFromHeader;
