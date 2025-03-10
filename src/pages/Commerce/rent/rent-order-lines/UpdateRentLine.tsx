import UpdateRentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-line-breadcrumbs/UpdateRentLineBreadcrumb";
import RentLineForm from "@/components/commerce/rent/rent-order-lines/Forms/RentLineForm";
import PageSection from "@/components/partials/PageSection";

const UpdateRentLine = () => {
  return (
    <PageSection>
      <UpdateRentLineBreadcrumb />
      <RentLineForm />
    </PageSection>
  );
};

export default UpdateRentLine;
