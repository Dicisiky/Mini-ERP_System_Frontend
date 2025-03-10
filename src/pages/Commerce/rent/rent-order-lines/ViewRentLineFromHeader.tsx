import RentLineFromHeaderBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-line-breadcrumbs/RentLineFromHeaderBreadcrumb";
import ViewRentLineDetails from "@/components/commerce/rent/rent-order-lines/DetailsView/RentLineDetailsView";
import PageSection from "@/components/partials/PageSection";

const ViewRentLineFromHeader = () => {
  return (
    <PageSection>
      <RentLineFromHeaderBreadcrumb />
      <ViewRentLineDetails />
    </PageSection>
  );
};

export default ViewRentLineFromHeader;
