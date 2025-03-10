import PageSection from "@/components/partials/PageSection";
import PurchaseOrderForm from "@/components/commerce/purchase-order/Forms/PurchaseOrdersForm";
import UpdatePurchaseOrderBreadcrumb from "@/components/commerce/purchase-order/breadcrumbs/UpdatePurchaseOrderBreadcrumb";

const UpdatePurchaseOrder = () => {
  return (
    <PageSection>
      <UpdatePurchaseOrderBreadcrumb />
      <PurchaseOrderForm />
    </PageSection>
  );
};

export default UpdatePurchaseOrder;
