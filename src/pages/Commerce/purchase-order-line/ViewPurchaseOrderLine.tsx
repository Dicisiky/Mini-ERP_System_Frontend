import ViewPurchaseOrderLineBreadcrumb from "@/components/commerce/purchase-order-line/breadcrumbs/ViewPurchaseOrderLineBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const ViewPurchaseOrderLine = () => {
  return (
    <PageSection>
      <ViewPurchaseOrderLineBreadcrumb />
      <ViewPurchaseOrderLine />
    </PageSection>
  );
};

export default ViewPurchaseOrderLine;
