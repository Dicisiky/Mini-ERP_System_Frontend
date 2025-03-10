import NewSalesOrderLineFromHeaderBreadcrumb from "@/components/commerce/sales-order-line/breadcrumbs/NewSalesOrderLineFromHeaderBreadcrumb";
import SalesOrderLineForm from "@/components/commerce/sales-order-line/Forms/SalesOrdersLinesForm";
import PageSection from "@/components/partials/PageSection";

const NewSalesOrderLineFromHeader = () => {
  return (
    <PageSection>
      <NewSalesOrderLineFromHeaderBreadcrumb />
      <SalesOrderLineForm />
    </PageSection>
  );
};

export default NewSalesOrderLineFromHeader;
