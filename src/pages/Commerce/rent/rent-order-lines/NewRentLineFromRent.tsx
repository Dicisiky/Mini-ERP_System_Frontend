import NewRentLineFromRentBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-line-breadcrumbs/NewRentLineFromRentBreadcrumb";
import RentLineForm from "@/components/commerce/rent/rent-order-lines/Forms/RentLineForm";
import PageSection from "@/components/partials/PageSection";

const NewRentLineFromRent = () => {
  return (
    <PageSection>
      <NewRentLineFromRentBreadcrumb />
      <RentLineForm />
    </PageSection>
  );
};

export default NewRentLineFromRent;
