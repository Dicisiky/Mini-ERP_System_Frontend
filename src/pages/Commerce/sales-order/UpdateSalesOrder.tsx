import PageSection from "@/components/partials/PageSection";
import SalesOrderForm from "@/components/commerce/sales-order/Forms/SalesOrdersForm";
import UpdateSalesOrderBreadcrumb from "@/components/commerce/sales-order/breadcrumbs/UpdateSalesOrderBreadcrumb";

const UpdateSalesOrder = () => {
  return (
    <PageSection>
      <UpdateSalesOrderBreadcrumb />
      <SalesOrderForm />
    </PageSection>
  );
};

export default UpdateSalesOrder;
