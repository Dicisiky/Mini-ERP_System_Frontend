import ViewPurchaseOrderLineFromHeaderBreadcrumb from "@/components/commerce/purchase-order-line/breadcrumbs/ViewPurchaseOrderLineFromHeaderBreadcrumb";
import ViewOrderLineDetails from "@/components/commerce/purchase-order-line/DetailsView/ViewOrderLineDetails";
import PageSection from "@/components/partials/PageSection";

const ViewPurchaseOrderLineFromHeader = () => {
  return (
    <PageSection>
      <ViewPurchaseOrderLineFromHeaderBreadcrumb />
      <ViewOrderLineDetails />
    </PageSection>
  );
};

export default ViewPurchaseOrderLineFromHeader;
