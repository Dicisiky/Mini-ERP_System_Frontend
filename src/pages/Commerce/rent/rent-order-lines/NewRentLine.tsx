import NewRentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/rent-line-breadcrumbs/NewRentLineBreadcrumb";
import RentLineForm from "@/components/commerce/rent/rent-order-lines/Forms/RentLineForm";
import PageSection from "@/components/partials/PageSection";

const NewRentLine = () => {
  return (
    <PageSection>
      <NewRentLineBreadcrumb />
      <RentLineForm />
    </PageSection>
  );
};

export default NewRentLine;
