import RentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-line-breadcrumbs/RentLineBreadcrumb";
import ViewRentLineDetails from "@/components/commerce/rent/rent-order-lines/DetailsView/RentLineDetailsView";
import PageSection from "@/components/partials/PageSection";

const ViewRentLine = () => {
  return (
    <PageSection>
      <RentLineBreadcrumb />
      <ViewRentLineDetails />
    </PageSection>
  );
};

export default ViewRentLine;
