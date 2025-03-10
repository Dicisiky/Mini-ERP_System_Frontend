import ViewPurchaseOrderBreadcrumb from "@/components/commerce/purchase-order/breadcrumbs/ViewPurchaseOrderBreadcrumb";
import ViewPurchaseOrderDetails from "@/components/commerce/purchase-order/DetailsView/ViewPurchaseOrderDetails";
import PageSection from "@/components/partials/PageSection";

const ViewPurchaseOrder = () => {
  return (
    <PageSection>
      <ViewPurchaseOrderBreadcrumb />
      <ViewPurchaseOrderDetails />
    </PageSection>
  );
};

export default ViewPurchaseOrder;
