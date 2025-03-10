import PageSection from "@/components/partials/PageSection";
import SalesOrderLineForm from "@/components/commerce/sales-order-line/Forms/SalesOrdersLinesForm";
import UpdateSalesOrderLineBreadcrumb from "@/components/commerce/sales-order-line/breadcrumbs/UpdateSalesOrderLineBreadcrumb";

const UpdateSalesOrderLine = () => {
  return (
    <PageSection>
      <UpdateSalesOrderLineBreadcrumb />
      <SalesOrderLineForm />
    </PageSection>
  );
};

export default UpdateSalesOrderLine;
