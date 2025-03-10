import UpdateRentBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-breadcrumbs/UpdateRentBreadcrumb";
import RentForm from "@/components/commerce/rent/rent-order/Forms/RentForm";
import PageSection from "@/components/partials/PageSection";

const UpdateRent = () => {
  return (
    <PageSection>
      <UpdateRentBreadcrumb />
      <RentForm />
    </PageSection>
  );
};

export default UpdateRent;
