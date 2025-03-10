import UpdateSalesOrderLineFromHeaderBreadcrumb from "@/components/commerce/sales-order-line/breadcrumbs/UpdateSalesOrderLineFromHeaderBreadcrumb";
import SalesOrderLineForm from "@/components/commerce/sales-order-line/Forms/SalesOrdersLinesForm";
import PageSection from "@/components/partials/PageSection";

const UpdateSalesOrderLineFromHeader = () => {
  return (
    <PageSection>
      <UpdateSalesOrderLineFromHeaderBreadcrumb />
      <SalesOrderLineForm />
    </PageSection>
  );
};

export default UpdateSalesOrderLineFromHeader;
