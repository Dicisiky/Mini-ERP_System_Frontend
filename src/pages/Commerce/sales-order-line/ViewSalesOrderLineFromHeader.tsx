import ViewSalesOrderLineFromHeaderBreadcrumb from "@/components/commerce/sales-order-line/breadcrumbs/ViewSalesOrderLineFromHeaderBreadcrumb";
import ViewOrderLineDetails from "@/components/commerce/sales-order-line/DetailsView/ViewOrderLineDetails";
import PageSection from "@/components/partials/PageSection";

const ViewSalesOrderLineFromHeader = () => {
  return (
    <PageSection>
      <ViewSalesOrderLineFromHeaderBreadcrumb />
      <ViewOrderLineDetails />
    </PageSection>
  );
};

export default ViewSalesOrderLineFromHeader;
