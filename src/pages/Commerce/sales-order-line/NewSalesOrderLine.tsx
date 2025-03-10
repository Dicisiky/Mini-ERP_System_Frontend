import SalesOrderLineForm from "@/components/commerce/sales-order-line/Forms/SalesOrdersLinesForm";
import NewSalesOrderLineBreadcrumb from "@/components/commerce/sales-order-line/breadcrumbs/NewSalesOrderLineBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const NewSalesOrderLine = () => {
  return (
    <PageSection>
      <NewSalesOrderLineBreadcrumb />
      <SalesOrderLineForm />
    </PageSection>
  );
};

export default NewSalesOrderLine;
