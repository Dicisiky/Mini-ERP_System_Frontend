import PageSection from "@/components/partials/PageSection";
import PurchaseOrderLineForm from "@/components/commerce/purchase-order-line/Forms/PurchaseOrdersLinesForm";
import UpdatePurchaseOrderLineBreadcrumb from "@/components/commerce/purchase-order-line/breadcrumbs/UpdatePurchaseOrderLineBreadcrumb";

const UpdatePurchaseOrderLine = () => {
  return (
    <PageSection>
      <UpdatePurchaseOrderLineBreadcrumb />
      <PurchaseOrderLineForm />
    </PageSection>
  );
};

export default UpdatePurchaseOrderLine;
