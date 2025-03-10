import UpdateRentLineFromRentBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-line-breadcrumbs/UpdateRentLineFromRentBreadcrumb";
import RentLineForm from "@/components/commerce/rent/rent-order-lines/Forms/RentLineForm";
import PageSection from "@/components/partials/PageSection";

const UpdateRentLineFromRent = () => {
  return (
    <PageSection>
      <UpdateRentLineFromRentBreadcrumb />
      <RentLineForm />
    </PageSection>
  );
};

export default UpdateRentLineFromRent;
