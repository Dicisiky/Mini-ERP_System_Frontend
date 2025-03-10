import ViewSalesOrderBreadcrumb from "@/components/commerce/sales-order/breadcrumbs/ViewSalesOrderBreadcrumb";
import ViewSalesOrderDetails from "@/components/commerce/sales-order/DetailsView/ViewSalesOrderDetails";
import PageSection from "@/components/partials/PageSection";

const ViewSalesOrder = () => {
  return (
    <PageSection>
      <ViewSalesOrderBreadcrumb />
      <ViewSalesOrderDetails />
    </PageSection>
  );
};

export default ViewSalesOrder;
