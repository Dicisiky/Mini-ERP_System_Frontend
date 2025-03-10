import ViewRentOrderBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-breadcrumbs/ViewRentOrderBreadcrumb";
import ViewRentDetails from "@/components/commerce/rent/rent-order/DetailsView/ViewRentDetails";
import PageSection from "@/components/partials/PageSection";

const ViewRentOrder = () => {
  return (
    <PageSection>
      <ViewRentOrderBreadcrumb />
      <ViewRentDetails />
    </PageSection>
  );
};

export default ViewRentOrder;
